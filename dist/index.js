"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseICleaningAPI = exports.getPrices = exports.printPrice = exports.TreeAgbis = exports.PriceItem = void 0;
/**
 * Элемент прайс листа
 */
var PriceItem = /** @class */ (function () {
    function PriceItem() {
    }
    return PriceItem;
}());
exports.PriceItem = PriceItem;
/**
 * Структура прайс листа
 */
var TreeAgbis = /** @class */ (function () {
    function TreeAgbis(name) {
        this.name = name;
        this.children = [];
        this.price = [];
        var num = /(\d+)\.\s*(.+)/i.exec(this.name);
        this.num = +num[1];
        this.title = num[2];
    }
    TreeAgbis.prototype.sort = function () {
        this.children = this.children.sort(function (r, l) { return r.num - l.num; });
        this.children.forEach(function (r) { return r.sort(); });
        this.price = this.price.sort(function (l, r) { return l.name > r.name ? 1 : -1; });
    };
    TreeAgbis.prototype.search = function (title, startFlag) {
        var res = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var i = _a[_i];
            res = res.concat(i.search(title, startFlag));
        }
        ;
        var reg = startFlag ? new RegExp("^(" + title + ")", "i") : new RegExp("(" + title + ")", "i");
        res = res.concat(this.price.filter(function (r) { return reg.test(r.name); }));
        return res;
    };
    return TreeAgbis;
}());
exports.TreeAgbis = TreeAgbis;
function cleanUTFText(text) {
    return decodeURI(text).replace(/([+])/g, " ").replace(/(\%2F)/gi, "/").replace(/(\%2B)/gi, "+");
}
/**
 *
 * @param tree Структура прайс листа
 * @param iteration уровень вложенности
 */
function printPrice(tree, iteration) {
    if (iteration === void 0) { iteration = 1; }
    var str = "#".repeat(iteration) + " " + tree.title + "\n";
    if (tree.children) {
        tree.children.forEach(function (child) {
            str += printPrice(child, (iteration + 1)) + "\n";
        });
    }
    if (tree.price) {
        tree.price.forEach(function (item) {
            str += [" ".repeat(iteration + 1), "-", item.code, item.name.padEnd(60, '.'), item.price.toString().padStart(5, ' '), item.unit].join(" ") + "\n";
        });
    }
    return str + "\n";
}
exports.printPrice = printPrice;
/**
 * Получить обработанный прайс лист
 * @param extdata Структура прайс листа
 */
function getPrices(extdata) {
    var item = extdata.answer;
    var EXCLUDED_GROUPS = extdata.excluded_groups;
    var top_parent, name, unit, group_p, group_c, name_group_c, name_group_p, folder_id;
    var dataset = [];
    var prices = new TreeAgbis("0. Root");
    for (var _i = 0, _a = item.price_list; _i < _a.length; _i++) {
        var p = _a[_i];
        top_parent = cleanUTFText(p.top_parent);
        var pre = /^([\d\.]+)\.\s?(.*)/;
        if (!pre.test(top_parent))
            continue;
        name = cleanUTFText(p.name);
        unit = cleanUTFText(p.unit);
        group_p = cleanUTFText(p.group_p);
        group_c = cleanUTFText(p.group_c);
        if (!pre.test(group_c))
            continue;
        var partGroupC = pre.exec(group_c);
        name_group_c = partGroupC[2];
        if (EXCLUDED_GROUPS.indexOf(name_group_c) != -1)
            continue;
        if (group_p) {
            var partGroupP = pre.exec(group_p);
            if (!partGroupP)
                continue;
            name_group_p = partGroupP[2];
            if (EXCLUDED_GROUPS.indexOf(name_group_p) != -1)
                continue;
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
    var topGroups = new Set();
    var groups = new Set();
    dataset.map(function (r) {
        var treeTop;
        if (!r.group_p) {
            r['group_p'] = "300.Дополнительные услуги";
        }
        if (topGroups.has(r.group_p)) {
            treeTop = prices.children.find(function (tr) { return tr.name == r.group_p; });
        }
        else {
            treeTop = new TreeAgbis(r.group_p);
            prices.children.push(treeTop);
            topGroups.add(r.group_p);
            treeTop.parent = prices;
        }
        var node;
        if (groups.has(r.group_c)) {
            node = treeTop.children.find(function (tr) { return tr.name == r.group_c; });
        }
        else {
            groups.add(r.group_c);
            node = new TreeAgbis(r.group_c);
            node.parent = treeTop;
            treeTop.children.push(node);
        }
        node.price.push(r);
        return ({ name: r.name, parent: r.group_p, group: r.group_c });
    });
    prices.sort();
    return prices;
}
exports.getPrices = getPrices;
/**
 * Интерфейс ответа сервера ICleaning
 */
var ResponseICleaningAPI = /** @class */ (function () {
    function ResponseICleaningAPI() {
    }
    return ResponseICleaningAPI;
}());
exports.ResponseICleaningAPI = ResponseICleaningAPI;
//# sourceMappingURL=index.js.map