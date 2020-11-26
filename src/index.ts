
/**
 * Элемент прайс листа
 */
export class PriceItem {
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
export class TreeAgbis {
    parent: TreeAgbis;
    children: TreeAgbis[] = [];
    price: PriceItem[] = [];
    title: string;
    num: number;
    constructor(public name: string) {
        let num = /(\d+)\.\s*(.+)/i.exec(this.name);
        this.num = +num[1];
        this.title = num[2];
    }
    sort() {
        this.children = this.children.sort((r, l) => r.num - l.num);
        this.children.forEach(r => r.sort());
        this.price = this.price.sort((l, r) => l.name > r.name ? 1 : -1);
    }
    search(title: string, startFlag: boolean): PriceItem[] {
        let res: PriceItem[] = [];
        for (let i of this.children) {
            res = res.concat(i.search(title, startFlag));
        };
        let reg = startFlag ? new RegExp("^(" + title + ")", "i") : new RegExp("(" + title + ")", "i");
        res = res.concat(this.price.filter(r => reg.test(r.name)))
        return res;
    }
}


function cleanUTFText(text: string) {
    return decodeURI(text).replace(/([+])/g, " ").replace(/(\%2F)/gi, "/").replace(/(\%2B)/gi, "+");
}

/**
 * 
 * @param tree Структура прайс листа
 * @param iteration уровень вложенности 
 */
export function printPrice(tree: TreeAgbis, iteration: number = 1): string {
    let str = "#".repeat(iteration) + " " + tree.title + "\n";
    if (tree.children) {
        tree.children.forEach(child => {
            str += printPrice(child, (iteration + 1)) + "\n";
        })
    }
    if (tree.price) {
        tree.price.forEach(item => {
            str += [" ".repeat(iteration + 1), "-", item.code, item.name.padEnd(60, '.'), item.price.toString().padStart(5, ' '), item.unit].join(" ") + "\n";

        })
    }
    return str + "\n";

}

/**
 * Получить обработанный прайс лист
 * @param extdata Структура прайс листа
 */
export function getPrices(extdata: ResponseICleaningAPIPrice<AgbisPrice>): TreeAgbis {

    let item = extdata.answer;
    const EXCLUDED_GROUPS = extdata.excluded_groups;
    let top_parent,
        name, unit, group_p, group_c, name_group_c, name_group_p, folder_id;

    var dataset = [];
    var prices = new TreeAgbis("0. Root");
    for (let p of item.price_list) {
        top_parent = cleanUTFText(p.top_parent);
        let pre = /^([\d\.]+)\.\s?(.*)/;

        if (!pre.test(top_parent)) continue;
        name = cleanUTFText(p.name);
        unit = cleanUTFText(p.unit);
        group_p = cleanUTFText(p.group_p);
        group_c = cleanUTFText(p.group_c);

        if (!pre.test(group_c)) continue;
        let partGroupC = pre.exec(group_c);
        name_group_c = partGroupC[2];
        if (EXCLUDED_GROUPS.indexOf(name_group_c) != -1) continue;

        if (group_p) { 
            const partGroupP = pre.exec(group_p);
            if (!partGroupP) continue;
            name_group_p = partGroupP[2];
            if (EXCLUDED_GROUPS.indexOf(name_group_p) != -1) continue;
        }


        folder_id = p.folder_id;
        var obj = {
            "id": p.id,
            "name": name,
            "unit": unit,
            "price": +p.price,
            "group_c": group_c,
            "group_p": group_p,
            "folder_id": folder_id,
            "order_addon_pack_id": p.order_addon_pack_id,
            "code": p.code,
            "price_id": p.price_id,
        };
        if (obj.price > 0)
            dataset.push(obj);
    }
    let topGroups = new Set<string>();
    let groups = new Set();

    dataset.map(r => {
        let treeTop;
        if (!r.group_p) {
            r['group_p'] = "300.Дополнительные услуги";
        }
        if (topGroups.has(r.group_p)) {
            treeTop = prices.children.find(tr => tr.name == r.group_p)
        } else {
            treeTop = new TreeAgbis(r.group_p);
            prices.children.push(treeTop);
            topGroups.add(r.group_p);
            treeTop.parent = prices;
        }

        let node;
        if (groups.has(r.group_c)) {
            node = treeTop.children.find(tr => tr.name == r.group_c)
        } else {
            groups.add(r.group_c);
            node = new TreeAgbis(r.group_c);
            node.parent = treeTop;
            treeTop.children.push(node);
        }
        node.price.push(r)

        return ({ name: r.name, parent: r.group_p, group: r.group_c })
    });
    prices.sort();
    return prices;
}

/**
 * Интерфейс ответа сервера ICleaning
 */
export class ResponseICleaningAPI<T> {
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