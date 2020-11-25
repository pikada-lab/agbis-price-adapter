
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
      console.log(num);
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



function cleanUTFText(text) {
    return decodeURI(text).replace(/([+])/g, " ").replace(/(\%2F)/gi, "/").replace(/(\%2B)/gi, "+");
  }
  
export function getPrices(extdata): TreeAgbis {
  
    let item = extdata.answer;
    const EXCLUDED_GROUPS = extdata.excluded_groups;
    let top_parent, number_top_parent, name_top_parent,
      name, unit, group_p, group_c, name_group_c, name_group_p, folder_id;
    let data = [];
    var dataset = [];
    var prices = new TreeAgbis("0. Root");
    for (let p of item.price_list) {
      top_parent = cleanUTFText(p.top_parent);
      let pre = new RegExp("^([\\d\\.]+)\\.\\s?(.*)");
      let m = pre.exec(top_parent);
      if (!m) continue;
      number_top_parent = m[1];
      name_top_parent = m[2];
      name = cleanUTFText(p.name);
      unit = cleanUTFText(p.unit);
      group_p = cleanUTFText(p.group_p);
      group_c = cleanUTFText(p.group_c);
  
      console.log(EXCLUDED_GROUPS, name_group_c, EXCLUDED_GROUPS.indexOf(name_group_c));
      m = pre.exec(group_c);
      if (!m) continue;
      name_group_c = m[2];
      if (EXCLUDED_GROUPS.indexOf(name_group_c) != -1)  continue;
  
      if(group_p) {
        m = pre.exec(group_p);
        if (!m) continue;
        name_group_p = m[2];
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
      if (p.name == "Хранение меха")
        console.log(p);
      if (obj.price > 0)
        dataset.push(obj);
    }
    let topGroups = new Set<string>();
    let groups = new Set();
  
    dataset.map(r => {
      let treeTop;
      if (!r.group_p) {
        r['group_p'] =   "300.Дополнительные услуги";
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
    let data1 = [];
    for (let i in data) {
      data1.push(data[i]);
    }
    data1.sort((a, b) => parseInt(a.top_parent) - parseInt(b.top_parent));
  
    for (let j in data1) {
      let value = data1[j];
      console.log(value);
      if (value["group_c"] != undefined) {
        let data2 = [];
        for (let i in value["group_c"]) {
          let value1 = value["group_c"][i];
          data2.push({
            "group_c": i,
            "name_group_c": value1["name_group_c"],
            "childred": value1["childred"]
          });
        }
        data2.sort((a, b) => parseInt(a.group_c) - parseInt(b.group_c));
        data1[j]["group_c"] = data2;
      }
    } 
    prices.sort();
    return prices;
  }