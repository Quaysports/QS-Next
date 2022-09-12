import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";

import { processExtendedProperties } from "./extended-properties";

interface SQLQuery {
    LINNID: string,
    SKU: string,
    TITLE: string,
    PURCHASEPRICE: string,
    RETAILPRICE: string,
    WEIGHT: string,
    EAN: string,
    ISCOMPOSITE: string,
    LISTINGVARIATION: string,
    PACKGROUP: string,
    COMSKU: string,
    COMTITLE: string,
    COMQTY: string,
    COMPP: string,
    COMWEIGHT: string,
    pkRowId: string,
    epName: string,
    epValue: string,
    epType: string
}


export const UpdateItems = async (skus?:string) => {
    await auth(true)

    function queryString() {
        return `SELECT si.pkStockItemID       AS LINNID,
                       si.ItemNumber          AS SKU,
                       si.ItemTitle           AS TITLE,
                       si.PurchasePrice       AS PURCHASEPRICE,
                       si.RetailPrice         AS RETAILPRICE,
                       si.Weight              AS WEIGHT,
                       si.BarcodeNumber       AS EAN,
                       si.bContainsComposites AS ISCOMPOSITE,
                       si.IsVariationGroup    AS LISTINGVARIATION,
                       si.PackageGroup        AS PACKGROUP,
                       si2.ItemNumber         AS COMSKU,
                       si2.ItemTitle          AS COMTITLE,
                       sic.Quantity           AS COMQTY,
                       si2.PurchasePrice      AS COMPP,
                       si2.Weight             AS COMWEIGHT,
                       ep.pkRowId             AS pkRowId,
                       ep.ProperyName         AS epName,
                       ep.ProperyValue        AS epValue,
                       ep.ProperyType         AS epType
                FROM StockItem si
                         LEFT JOIN Stock_ItemComposition sic ON si.pkStockItemId = sic.pkStockItemId
                         LEFT JOIN StockItem si2 ON sic.pkLinkStockItemId = si2.pkStockItemId
                         LEFT JOIN StockItem_ExtendedProperties ep ON si.pkStockItemID = ep.fkStockItemId
                WHERE (si.bLogicalDelete = 0 OR si.IsVariationGroup = 1)
                    ${skus ? "AND si.ItemNumber IN (" + skus + ")" : ""}`
    }

    console.log('Linn update all: All items download')
    console.log(new Date())

    const linnData = (await Linn.getLinnQuery<SQLQuery>(queryString())).Results
    const merge: Map<string,sbt.Item> = new Map()

    for (let item of linnData) {
        if (item.ISCOMPOSITE === "False") {
            if (!merge.has(item.SKU)) merge.set(item.SKU, createItemForUpdate(item, false))
            if (item.epName) processExtendedProperties(item, merge.get(item.SKU)!)
        } else {
            if (!merge.has(item.SKU)) merge.set(item.SKU, createItemForUpdate(item, true))
            addCompositeItemToParent(merge.get(item.SKU)!, item)
            if (item.epName) processExtendedProperties(item, merge.get(item.SKU)!)
        }
    }

    console.log('Linn update all: Merge Complete, Saving')
    console.log(new Date())

    return merge
}

const createItemForUpdate = (item: SQLQuery, composite: boolean):sbt.Item => {
    return {
        SKU: item.SKU,
        LINNID: item.LINNID,
        TITLE: item.TITLE,
        WEIGHT: item.WEIGHT && !composite ? parseFloat(item.WEIGHT) : 0,
        PURCHASEPRICE: item.PURCHASEPRICE && !composite ? parseFloat(item.PURCHASEPRICE) : 0,
        RETAILPRICE: item.RETAILPRICE ? parseFloat(item.RETAILPRICE) : 0,
        SHOPPRICEINCVAT: item.RETAILPRICE ? item.RETAILPRICE : "0",
        EAN: item.EAN,
        ISCOMPOSITE: (item.ISCOMPOSITE.toLowerCase() === 'true'),
        LISTINGVARIATION: (item.LISTINGVARIATION.toLowerCase() === 'true'),
        PACKGROUP: item.PACKGROUP,
        COMPDATA: [],
        EXTENDEDPROPERTY: [],
        IDBEP: {
            AMZLATENCY: 1,
            COMISO2: "GB",
            COMISO3: "GBR",
            TARIFFCODE: "9507"
        }
    }
}

const addCompositeItemToParent = (mergeItem:sbt.Item, item:SQLQuery) => {
    let pos = mergeItem.COMPDATA!.map(DBItem=>{return DBItem.SKU}).indexOf(item.COMSKU)
    if (pos !== -1) return
    mergeItem.PURCHASEPRICE! += (parseFloat(item.COMPP) * parseFloat(item.COMQTY))
    mergeItem.WEIGHT! += (parseInt(item.COMWEIGHT) * parseFloat(item.COMQTY))
    mergeItem.COMPDATA!.push({
        SKU: item.COMSKU,
        ItemTitle: item.COMTITLE,
        Quantity: parseFloat(item.COMQTY),
        PurchasePrice: parseFloat(item.COMPP),
        Weight: parseInt(item.COMWEIGHT)
    })
}