/**
 * Элемент прайс листа
 */
export declare class PriceItem {
    code: string;
    folder_id: string;
    group_c: string;
    group_p: string;
    id: number;
    name: string;
    order_addon_pack_id: string;
    price: string;
    price_id: string;
    unit: string;
}
/**
 * Структура прайс листа
 */
export declare class TreeAgbis {
    name: string;
    parent: TreeAgbis;
    children: TreeAgbis[];
    price: PriceItem[];
    title: string;
    num: number;
    constructor(name: string);
    sort(): void;
    search(title: string, startFlag: boolean): PriceItem[];
}
/**
 *
 * @param tree Структура прайс листа
 * @param iteration уровень вложенности
 */
export declare function printPrice(tree: TreeAgbis, iteration?: number): string;
/**
 * Получить обработанный прайс лист
 * @param extdata Структура прайс листа
 */
export declare function getPrices(extdata: ResponseICleaningAPIPrice<AgbisPrice>): TreeAgbis;
/**
 * Интерфейс ответа сервера ICleaning
 */
export declare class ResponseICleaningAPI<T> {
    status: boolean;
    answer: T;
}
/**
 * Интерфейс ответа сервера на запрос api/get_price_test/
 */
export interface ResponseICleaningAPIPrice<T> extends ResponseICleaningAPI<T> {
    prices: boolean;
    excluded_groups: string[];
}
/**
 * Структура ответа АГБИСа
 */
export interface AgbisPrice {
    price_list: AgbisPriceItem[];
    error: number;
}
/**
 * Элемент прайс листа АГБИСа
 */
export interface AgbisPriceItem {
    code: string;
    name: string;
    top_parent: string;
    price: string;
    order_addon_pack_id: string;
    sort_index: string;
    group_c: string;
    price_id: string;
    group_p: string;
    folder_id: string;
    id: number;
    unit: string;
}
