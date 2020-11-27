"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var fs_1 = require("fs");
var assert = require("assert");
var dataset = JSON.parse(fs_1.readFileSync("src/test/response.json", "utf8"));
var priceMD = fs_1.readFileSync("src/test/price.md", "utf8");
var price = __1.getPrices(dataset);
describe("Структурные признаки", function () {
    it("Количество категорий должно быть 6", function () {
        assert(price.children.length === 6);
    });
    it("Название каталога должно быть '0. Root'", function () {
        assert(price.name === '0. Root');
    });
    it("Количество элементов первого подкаталога должно быть 7", function () {
        assert(price.children[0].children.length === 7);
    });
    it("Заголовок первого подкаталога должен быть 'Химчистка текстильных изделий'", function () {
        assert(price.children[0].title === "Химчистка текстильных изделий");
    });
    it("Ссылка внутри каталога в параметре parent должна быть ссылка на родителя", function () {
        price.children.forEach(function (r) {
            assert(r.parent === price);
        });
    });
    it("У первого каталога не должно быть позиций прайса", function () {
        price.children.forEach(function (r) {
            assert(r.price.length === 0);
        });
    });
});
describe("Проверка сортировки", function () {
    it("У первого элемента должен быть самый маленький num", function () {
        price.children.forEach(function (r) {
            assert(r.num >= price.children[0].num);
        });
    });
    it("У последнего элемента должен быть самый большой num", function () {
        var last = price.children.length - 1;
        price.children.forEach(function (r) {
            assert(r.num <= price.children[last].num);
        });
    });
    it("У первого дочерного элемента должен быть самый маленький num", function () {
        price.children[0].children.forEach(function (r) {
            assert(r.num >= price.children[0].children[0].num);
        });
    });
    it("У последнего дочерного элемента должен быть самый большой num", function () {
        var last = price.children[0].children.length - 1;
        price.children[0].children.forEach(function (r) {
            assert(r.num <= price.children[0].children[last].num);
        });
    });
});
describe("Сборка в MD", function () {
    it("Должен быть такой же как и price.md", function () {
        assert(priceMD == __1.printPrice(price, 1));
    });
});
describe("Поиск", function () {
    it("Поиск по слову Ш должен возвращать 24 позиций", function () {
        assert(price.search("Ш", true).length === 24);
    });
    it("Поиск по слову Шу должен возвращать 5 позиций", function () {
        assert(price.search("Шу", true).length === 5);
    });
    it("Поиск по слову Шуб должен возвращать 5 позиций", function () {
        assert(price.search("Шуб", true).length === 5);
    });
    it("Поиск по слову Шуба должен возвращать 5 позиций", function () {
        assert(price.search("Шуба", true).length === 5);
    });
    it("Поиск по слову Шбуба должен возвращать 0 позиций", function () {
        assert(price.search("Шбуба", true).length === 0);
    });
});
//# sourceMappingURL=test.spec.js.map