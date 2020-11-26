# Адаптер для работы с каталогом АГБИС 

[![codecov](https://codecov.io/gh/pikada-lab/agbis-price-adapter/branch/main/graph/badge.svg)](https://codecov.io/gh/pikada-lab/agbis-price-adapter)
[![Build Status](https://travis-ci.org/pikada-lab/agbis-price-adapter.svg?branch=main)](https://travis-ci.org/github/pikada-lab/agbis-price-adapter)
[![Known Vulnerabilities](https://snyk.io/test/github/pikada-lab/agbis-price-adapter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pikada-lab/agbis-price-adapter?targetFile=package.json)


Акутальная версия API АГБИС 1.3

## Входной интерфейс 

- ResponseICleaningAPIPrice\<AgbisPrice>

## Возвращаемый интерфейс 

- TreeAgbis 
- PriceItem

## Экспортируеамые функции

### printPrice(tree: TreeAgbis, iteration: number = 1): string 
 Возвращает прайс лист в виде MarkDown строки

### getPrices(extdata: ResponseICleaningAPIPrice<AgbisPrice>): TreeAgbis
 Возвращает прайс лист в виде DI объекта - дерева

## Описание структуры 

Структура ответа API / интерфейс

| ResponseICleaningAPIPrice\<T> |
|---|
| + status: boolean |
| + prices: boolean |
| + excluded_groups: string[] |
| + answer: T |

Структура вложенной сущности прайс листа / интерфейс

| AgbisPrice |
|---|
| + price_list: AgbisPriceItem[] |
| + error: number |

Структура элемента прайс листа / интерфейс

| AgbisPriceItem |
| --- |
| + code: string | 
| + name: string | 
| + top_parent: string | 
| + price: string | 
| + order_addon_pack_id: string | 
| + sort_index: string | 
| + group_c: string | 
| + price_id: string | 
| + group_p: string | 
| + folder_id: string |  
| + id: number | 
| + unit: string | 

Возвращаемый интерфейс TreeAgbis / класс

| TreeAgbis |
|:---------|
| + parent: TreeAgbis |
| + children: TreeAgbis[]  |
| + price: PriceItem[] |
| + title: string |
| + num: number |
| + name: string |
| + constructor(name: stirng) |
| + constructor(name: stirng) |
| + sort() |
| + search(title: string, startFlag: boolean): PriceItem[] |

PriceItem Находится в композиции с TreeAgbis / класс

| PriceItem |
| :--- |
| + code: string |
| + folder_id: string |
| + group_c: string |
| group_p: string |
| id: number |
| name: string |
| order_addon_pack_id: string |
| price: string |
| price_id: string |
| unit: string |

# Примеры

Инициализация и поиск

```typescript
const tree: TreeAgbis = getPrices(extdata);
tree.search("Доп");
```

Преобразование в MarkDown
```typescript
let dataset = JSON.parse(readFileSync("src/test/response.json", "utf8"));
let price = getPrices(dataset);
let src = printPrice(price,1);
console.log(src);
```