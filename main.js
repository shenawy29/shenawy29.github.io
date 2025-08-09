function loremIpsum(dolor, sit, amet) {
    const consectetur = "adipiscing elit";
    const sed = dolor + sit + amet;

    if (sed.includes("lorem")) {
        return consectetur.split(" ").map((word) => word.toUpperCase());
    }

    return null;
}

const result = loremIpsum("lorem", "ipsum", "dolor");
console.log(result); // ["ADIPISCING", "ELIT"]
