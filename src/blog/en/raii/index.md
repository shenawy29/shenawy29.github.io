---
title: The Memory Canister is Leaking
pubDate: 2025-08-10
tags: [cpp, memory-management]
keywords: ["RAII", "C++", "smart pointers", "memory safety", "destructors"]
ogSubtitle: Resource Acquisition Is Initialization
slug: raii
---

Since most of the languages we use have some form of garbage collection, very few people actually think about memory in a practical way. Who cares when you call `new Foo()`?

You’re right. If you’re using a language like Java or Go, you probably don’t think about it much. However, if you’re using C++, it’s a different story. Any heap allocation you make with `new` **must** be freed with `delete`. It’s simple, right? When I’m done with something, I delete it!

Although the concept seems simple on the surface, humans are, by nature, fallible. Because of this, Microsoft says that [70% of the security bugs in its products are caused by memory-related bugs](https://www.zdnet.com/article/microsoft-70-percent-of-all-security-bugs-are-memory-safety-issues/). Most of these bugs are caused by “use after free,” which means you use a `vector` allocated with `new`, for example, after you’ve called `delete` on it.

This in itself proves that the `new` and `delete` approach isn’t ideal, because even when you remember to call `delete`, you might forget and accidentally use the memory you’ve already `delete`d again!

Languages with garbage collection don’t have these kinds of problems, but you pay another price: garbage collection itself.

Yes, you probably won’t have memory bugs, but garbage collection itself isn’t free. The language’s runtime takes time to identify unused resources and free them up!

Discord solved the garbage collection problem in their services (which use Go) by [adjusting the settings of the garbage collector itself](https://discord.com/blog/why-discord-is-switching-from-go-to-rust), but they didn’t stick with that decision and chose to use a different language because the solution wasn’t ideal.

So we have a problem. We want a language fast enough to meet our needs, but at the same time, we want to make it difficult to accidentally create vulnerabilities due to how we use memory.

## RAII - Resource Acquisition Is Initialization

RAII. Resource Acquisition Is Initialization. It might be the worst name in the world, but it’s self-explanatory.

To understand what RAII is and how to use it, we need to talk in somewhat abstract terms.

If we think about what we do in most object-oriented languages, we declare variables and perform certain operations on them, whether they’re functions, methods, or whatever. But the key point is that we **_can’t use something unless we give it a name_**. The `vector` we’re creating could be named `v`, for example. How can we use something if it doesn’t exist in the program itself?

RAII is based on this idea. Every “name” in the program is responsible for freeing the memory it uses.

```cpp
std::vector<int>* x = new std::vector<int>();
```

In this code, `x` is the name, and it’s responsible for freeing the `vector`’s memory.

What about this?

```cpp
int y = 42;
```

There’s a difference here.
The difference is that `x` is responsible for freeing something allocated on the heap. Anything dynamically allocated with `new` **must** remain in its own memory location so it can survive beyond its scope.

For example:

```cpp
#include <vector>

void foo() {
    std::vector<int>* x = new std::vector<int>();
}
```

The vector’s memory won’t be freed after the function call finishes, because you’re using `new`.

But here:

```cpp
void foo() {
    int y = 42;
}
```

This variable is on the stack. It’s not dynamically allocated. We didn’t use `new`, so its memory will be freed when the function call ends.

RAII uses this concept for heap-allocated resources.

As soon as its scope ends, for example, when the function call it’s in finishes, it’s responsible for freeing the memory associated with the resource it holds.

So, how do we use RAII in C++? The Standard Library provides this capability in the `<memory>` library. The basic type you can use is `unique_ptr`. Its name might sound a bit suspicious, like RAII, but it actually explains exactly what it does. It is a pointer, yes, but a “unique” one, distinct in that it is **the only entity responsible for freeing its own resource**.

For example:

```cpp
#include <iostream>
#include <vector>
#include <memory>

int main() {
    std::unique_ptr<std::vector<int>> vec = std::make_unique<std::vector<int>>(5);
    // The memory is freed here.
    return 0;
}
```

Notice there isn’t a single `new` keyword in the code? Yet the `vector` is indeed dynamically allocated.

Want proof? Take a look at the assembly code.

```asm
main:
        push    rbp
        mov     rbp, rsp
        push    rbx
        sub     rsp, 24
        mov     DWORD PTR [rbp-20], 5
        lea     rax, [rbp-32]
        lea     rdx, [rbp-20]
        mov     rsi, rdx
        mov     rdi, rax
        call    std::__detail::_MakeUniq<std::vector<int, std::allocator<int>>>::__single_object std::make_unique<std::vector<int, std::allocator<int>>, int>(int&&) ;[!code focus]
        mov     ebx, 0
        lea     rax, [rbp-32]
        mov     rdi, rax
        call    std::unique_ptr<std::vector<int, std::allocator<int>>, std::default_delete<std::vector<int, std::allocator<int>>>>::~unique_ptr() [complete object destructor] ;[!code focus]
        mov     eax, ebx
        mov     rbx, QWORD PTR [rbp-8]
        leave
        ret
.LC0:
        .string “cannot create std::vector larger than max_size()”
```

You'll notice that the second line uses something called `std::default_delete`. If we look at the [Documentation](https://en.cppreference.com/w/cpp/memory/default_delete.html), we'll find that it says this:

> The non-specialized `default_delete` uses `delete` to deallocate memory for a single object

This means that since this type uses `delete`, the resource is dynamically allocated!

Here, we were assuming we’re using dynamic memory on the heap. However, you can use it in a more general way. For example, a file you’ve used and want to close when you no longer need it.

## Conclusion

The goal of this post is to further illustrate the concept of RAII, but there are many things I haven’t covered. Suppose I want a single user to own a single resource and need that resource to be used in multiple places?

In that case, you’d use [`shared_ptr`](https://en.cppreference.com/w/cpp/memory/shared_ptr.html). This type uses a technique called [Reference Counting](https://en.wikipedia.org/wiki/Reference_counting). Keep in mind that this technique is relatively slow!

Fun Fact: Every object you create in Python uses Reference Counting by default to determine when the object’s memory should be freed!
