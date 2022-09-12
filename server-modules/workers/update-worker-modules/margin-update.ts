import mongoI = require("../../mongo-interface/mongo-interface");
import Margin = require("../../margin-calculation/margin-calculation")
import Fees = require('../../fees/fees')
import Postage = require('../../postage/postage')
import Packaging = require('../../packaging/packaging')

export const marginUpdate = async (merge = (new Map<string, sbt.Item>()), skus?:string) => {

    console.log("querying margin data!")
    console.log(new Date())

    await Postage.init()
    await Packaging.init()
    await Fees.init()

    let query = skus ? {SKU: {$in: skus.replace(/'/g, "").split(",")}} : {};

    const items = await mongoI.find<sbt.Item>("Items", query, {
        SKU: 1,
        LINNID: 1,
        ISCOMPOSITE: 1,
        PACKAGING: 1,
        PACKGROUP: 1,
        CP: 1,
        CD: 1,
        POSTID: 1,
        POSTMODID: 1,
        EBAYPRICEINCVAT: 1,
        AMZPRICEINCVAT: 1,
        QSPRICEINCVAT: 1,
        SHOPPRICEINCVAT: 1,
        MD: 1,
        PURCHASEPRICE: 1,
        RETAILPRICE: 1,
        IDBEP: 1,
        IDBFILTER: 1,
        AMZPRIME: 1,
        MARGINNOTE: 1,
        LASTUPDATE: 1
    })

    if(!items) return merge

    console.log("items: " + items.length)

    for (let item of items) {
        let clone:sbt.Item = merge.has(item.SKU) ? merge.get(item.SKU)! : {SKU: item.SKU}
        merge.set(item.SKU, {...item,...clone})
        setShopPrices(item, merge.get(item.SKU)!)
    }

    for(const [_, item] of merge) await Margin.process(item, Fees, Postage, Packaging);
    return merge
}

const setShopPrices = (item:sbt.Item, mergeItem:sbt.Item) =>{
    if (item.SHOPPRICEINCVAT) {
        if (item.IDBFILTER === "domestic" || item.IDBFILTER === "bait") {
            if (item.RETAILPRICE) item.SHOPPRICEINCVAT = item.RETAILPRICE.toString()
        } else {
            if (item.QSPRICEINCVAT) item.SHOPPRICEINCVAT = item.QSPRICEINCVAT
        }
        mergeItem.SHOP = {
            PRICE: item.SHOPPRICEINCVAT,
            STATUS: 3
        }
    } else {
        mergeItem.SHOP = item.IDBFILTER === "domestic" || item.IDBFILTER === "bait"
            ? {PRICE: item.RETAILPRICE ? item.RETAILPRICE.toString() : "0", STATUS: 3}
            : {PRICE: item.QSPRICEINCVAT ? item.QSPRICEINCVAT : "0", STATUS: 3};
    }
}
