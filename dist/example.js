"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var _1 = require(".");
var dataset = JSON.parse(fs_1.readFileSync("src/test/response.json", "utf8"));
var price = _1.getPrices(dataset);
var src = _1.printPrice(price, 1);
console.log(dataset.answer.price_list[0]);
// writeFileSync("./src/test/price.md", src)
//# sourceMappingURL=example.js.map