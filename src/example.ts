import { readFileSync, writeFileSync } from "fs";
import { getPrices, printPrice  } from ".";

let dataset = JSON.parse(readFileSync("src/test/response.json", "utf8"));
let price = getPrices(dataset);
let src = printPrice(price,1);
console.log(dataset.answer.price_list[0]);
// writeFileSync("./src/test/price.md", src)