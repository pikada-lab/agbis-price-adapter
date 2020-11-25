# Адаптер для работы с каталогом АГБИС 

Акутальная версия API АГБИС 1.3

## Возвращаемый интерфейс 

- TreeAgbis 
- PriceItem

## Описание структуры 

| TreeAgbis |
|:--------- |
|  + parent: TreeAgbis |
|  + children: TreeAgbis[]  |
|  +  price: PriceItem[] |
|  +  title: string |
|  +  num: number |
| +  name: string |
| + constructor(name: stirng) |
| + constructor(name: stirng) |
| + sort() |
| + search(title: string, startFlag: boolean): PriceItem[] |

TreeAgbis Находится в отношении композиции к PriceItem

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

## Пример

```typescript
const tree: TreeAgbis = getPrices(extdata);
```