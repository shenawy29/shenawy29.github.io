---
layout: ../../lib/layouts/base_layout.astro
title: طرمبة الMemory بتسرب
subtitle: اصلحها ازاي؟
pubDate: 2025-08-10
tags: [concepts]
slug: raii
---

عشان معظم اللغات اللي بنستعملها فيها نوع من الـGarbage Collection، قليل اوي اللي بتلاقيه بيفكر فالـMemory بطريقة عملية. فيها اية يعني لو عملت `()new Foo`؟

عندك حق. لو بتستعمل لغة زي Java او Go، غالباً مش هتفكر فالموضوع كتير. بس، لو بتستعمل ++ C، الموضوع يختلف. اي Heap Allocation بتعملها ب`new` **_لازم_** تعملها Free ب`delete`. الموضوع بسيط، صح؟ لما اخلص حاجة، همسحها!

بالرغم من ان الموضوع بسيط سطحياً، البني ادمين بطبيعتهم خطائين. وبسبب دا، مايكروسوفت بتقول ان [%70 من الSecurity Bugs في منتجاتها بسبب Bugs ليها علاقة بالـMemory](https://www.zdnet.com/article/microsoft-70-percent-of-all-security-bugs-are-memory-safety-issues/). اغلبية الـBugs دي بسبب Use After Free، يعني انك تستعمل `vector` معموله Allocation بـ`new` مثلاً بعد ماتعمله `delete`.

دا فحد ذاته بيثبت ان فكرة ال`new` و `delete` مش احسن حاجة، لأن حتى لما بتفتكر تعمل `delete`، ممكن تنسى وتستعمل الحاجة اللي انت عملتلها `delete` تاني بالغلط!

اللغات اللي فيها Garbage Collection مفيهاش مشاكل من النوع دا، بس انت بتدفع تمن تاني: الـGarbage Collection ذات نفسها.

ايوة غالباً مش هيبقى عندك Memory Bugs، بس الـGarbage Collection نفسها مش مجانية. الـRuntime بتاعت اللغة بتاخد وقت انها تشوف الحاجات اللي مش مستخدمة وتعملها Free!

ديسكورد حل المشكلة بتاعت الـGarbage Collection في الـServices بتاعتهم اللي [بتستعمل Go بأنهم يعدلوا الـSettings بتاعت الـGarbage Collector نفسه](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)، بس مثبتوش على قرارهم وقرروا يستعملوا لغة تانية لأن الحل مكنش احسن حاجة.

كدا احنا عندنا مشكلة. عايزين لغة سريعة كفاية بأنها تأدي احتياجاتنا، وفنفس الوقت يبقى صعب اننا نعمل Vulnerabilities بالغلط بسبب طريقتنا في استعمال الـMemory.

## RAII - Resource acquisition Is Initialization

راي - Resource Acquisition Is Initialization. ممكن اسوء اسم فالعالم، بس بيشرح نفسه.

عشان نفهم اية هي راي، ونستعملها ازاي، محتاجين نتكلم بطريقة تجريدية شوية.

لو فكرنا فاللي احنا بنعمله في معظم اللغات الـObject Oriented، احنا بنعمل Variables و نعمل شوية حاجات على الVariables دي. Functions، Methods مهما كان. بس الفكرة ان احنا **_منقدرش نستعمل حاجة الا لما نديلها اسم_**. الـ`vector` اللي احنا بنعمله ممكن يبقى اسمه `v` مثلاً. هستعمل حاجة ازاي لو هي ملهاش وجود فالبرنامج نفسه؟

راي يعتبر مبني على الفكرة دي. اي "اسم" فالبرنامج هو المسؤول عن انه يحرر الـMemory اللي بيستعملها.

```cpp
std::vector<int>* x = new std::vector<int>();
```

فالكود دا، `x` هو الاسم، وهو مسؤول انه يحرر الـMemory بتاعت الـ`vector`.

طب ودا؟

```cpp
int y = 42;
```

هنا في فرق.
الفرق هنا ان `x` مسؤول انه يحرر حاجة محطوطة في الHeap. اي حاجة Dynamically allocated بـ`new` **_لازم_** تبقى في مكان الـMemory بتاعته تقدر تفضل بعد الـScope بتاعها.

فا هنا مثلاً:

```cpp
#include <vector>

void foo() {
    std::vector<int>* x = new std::vector<int>();
}
```

الـMemory بتاعت الVector مش هتتحرر بعد مالـFunction Call تخلص، لأنك بتستعمل `new`.

بس هنا:

```cpp
void foo() {
    int y = 42;
}
```

24 دا موجود على الـStack. مش Dynamically Allocated، مستعملناش `new`، فالـMemory بتاعته هتتحرر لما الـFunction Call تخلص.

راي بتستعمل الفكرة دي للحاجات الـHeap Allocated.

اول لما اسم الـScope بتاعه يخلص، يعني مثلاً الـFunction Call اللي هو فيها تخلص، هو من مسؤوليته انه يحرر الـMemory بتاعت الـResource اللي هو ماسكه.

تمام زي الفل، نستعمل راي ازاي في++ C؟ الStandard Library بتتيحلنا الامكانية دي في `<memory>`. الType الاساسي اللي ممكن تستعمله هو `unique_ptr`. اسمه ممكن يكون مريب شوية زي RAII، بس هو فعلاً شارح هو بيعمل اية. هو Pointer ايوة، بس Unique...مميز. في حيث انه هو **_الشخص الوحيد المسؤول انه يحرر الResource بتاعه_**.

كمثال:

```cpp
#include <iostream>
#include <vector>
#include <memory>

int main() {
    std::unique_ptr<std::vector<int>> vec = std::make_unique<std::vector<int>>(5);
    // الميموري بتخلص هنا.
    return 0;
}
```

ملاحظ ان مفيش ولا كلمة `new` فالكود؟ ولكن فعلاً الـ`vector`دا Dynamically Allocated.

عايز دليل؟ بص عالـAssembly.

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
        .string "cannot create std::vector larger than max_size()"
```

هتلاحظ ان السطر التاني بيستعمل حاجة اسمها `std::default_delete`. لو بصينا على الـ[Documentation](https://en.cppreference.com/w/cpp/memory/default_delete.html) هنلاقيها بتقول دا:

> The non-specialized default_delete uses delete to deallocate memory for a single object

معنى ان الـType دا بيستعمل `delete` ان الـResource دا Dynamically Allocated!

هنا كنا بنستعمل راي في اننا نستعمل Dynamic Memory على الـHeap. بس، راي ممكن تستعملها بطريقة عامة اكتر. ملف مثلاً استعملته وعايز تقفله لما متكونش محتاجة.

## الناهية

الهدف من البوست دا انه يظهر فكرة RAII اكتر، بس في حاجات كتير متكلمتش عنها. افرض انا عايز كذا حد يملك Resource واحد و محتاج الـResource دا استعمله في اماكن كتير؟

في الحالة دي هتستعمل [`shared_ptr`](https://en.cppreference.com/w/cpp/memory/shared_ptr.html). الـType دا بيستعمل Technique اسمه [Reference Counting](https://en.wikipedia.org/wiki/Reference_counting). الـTechnique دا بطيء نسبياً، فاخد بالك!

Fun Fact: كل Object انت بتعملها في Python هتلاقيها By default بتستعمل Reference Counting عشان تحدد الـMemory بتاعت الـObject دي تتحرر امتى!
