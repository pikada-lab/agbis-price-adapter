import { getPrices, printPrice } from "..";
import { readFileSync } from "fs";
import assert = require("assert");


let dataset = JSON.parse(readFileSync("src/test/response.json", "utf8"));
let priceMD =  readFileSync("src/test/price.md", "utf8");
let price = getPrices(dataset);
describe("Структурные признаки", () => {
 
    it("Количество категорий должно быть 6", () => {
        assert(price.children.length === 6)
    });

    it("Название каталога должно быть '0. Root'", () => {
        assert(price.name === '0. Root')
    });

    it("Количество элементов первого подкаталога должно быть 7", () => {
        assert(price.children[0].children.length === 7)
    });

    it("Заголовок первого подкаталога должен быть 'Химчистка текстильных изделий'", () => {
        assert(price.children[0].title === "Химчистка текстильных изделий")
    });

    it("Ссылка внутри каталога в параметре parent должна быть ссылка на родителя", () => {
        price.children.forEach(r => {
            assert(r.parent === price)
        })
    });
    it("У первого каталога не должно быть позиций прайса", () => {
        price.children.forEach(r => {
            assert(r.price.length === 0)
        })
    });
})

describe("Проверка сортировки", () => {
    it("У первого элемента должен быть самый маленький num", () => {
        price.children.forEach(r => {
            assert(r.num >= price.children[0].num);
        })
    });
    it("У последнего элемента должен быть самый большой num", () => {
        let last = price.children.length - 1;
        price.children.forEach(r => {
            assert(r.num <= price.children[last].num);
        })
    });
    it("У первого дочерного элемента должен быть самый маленький num", () => {
        price.children[0].children.forEach(r => {
            assert(r.num >= price.children[0].children[0].num);
        })
    });
    it("У последнего дочерного элемента должен быть самый большой num", () => {
        let last = price.children[0].children.length - 1;
        price.children[0].children.forEach(r => {
            assert(r.num <= price.children[0].children[last].num);
        })
    });
});

describe("Сборка в MD", () => {
    it("Должен быть такой же как и price.md", () => {
        assert(priceMD == printPrice(price,1));
    })
})
describe("Поиск", () => {
    it("Поиск по слову Ш должен возвращать 24 позиций", () => {
        assert(price.search("Ш", true).length === 24);
    })
    it("Поиск по слову Шу должен возвращать 5 позиций", () => {
        assert(price.search("Шу", true).length === 5);
    })
    it("Поиск по слову Шуб должен возвращать 5 позиций", () => {
        assert(price.search("Шуб", true).length === 5);
    })
    it("Поиск по слову Шуба должен возвращать 5 позиций", () => {
        assert(price.search("Шуба", true).length === 5);
    })
    it("Поиск по слову Шбуба должен возвращать 0 позиций", () => {
        assert(price.search("Шбуба", true).length === 0);
    })
})