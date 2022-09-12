import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";

export const getLinnworksChannelPrices = async (merge = (new Map<string, sbt.Item>()), skus?:string) => {
    await auth(true)
    console.log("querying CP data!")
    console.log(new Date())

    interface SQLQuery {
        ItemNumber: string, Source:string, SubSource:string, Price:string, UpdateStatus:string, pkRowId:string
    }

    let query = `SELECT si.ItemNumber,
                        sp.Source,
                        sp.SubSource,
                        sp.SalePrice as Price,
                        sp.UpdateStatus,
                        sp.pkRowId
                 FROM StockItem si
                          INNER JOIN StockItem_Pricing sp on si.pkStockItemId = sp.fkStockItemId
                 WHERE si.bLogicalDelete = 0
                   AND sp.SubSource <> 'https://quaysports.com'
                     ${skus ? "AND si.ItemNumber IN (" + skus + ")" : ""}`

    const result = (await Linn.getLinnQuery<SQLQuery>(query)).Results

    for (let item of result) {
        if (!merge.has(item.ItemNumber)) merge.set(item.ItemNumber, {SKU: item.ItemNumber, CP:{}})
        let mergeItem = merge.get(item.ItemNumber)!
        merge.get(item.ItemNumber)!.CP ??= {}

        let cp:sbt.channelPriceData = {
            PRICE: item.Price,
            SUBSOURCE: item.SubSource,
            UPDATED: (new Date()).toString()
        }

        if (item.pkRowId) cp.ID = item.pkRowId
        if (item.UpdateStatus) cp[`STATUS`] = parseInt(item.UpdateStatus)
        if (item.Source === "AMAZON" && mergeItem.AMZPRICEINCVAT) {
            if (parseFloat(mergeItem.AMZPRICEINCVAT) !== parseFloat(item.Price)) cp.updateReq = true
        }
        if (item.Source === "EBAY" && mergeItem.EBAYPRICEINCVAT) {
            if (parseFloat(mergeItem.EBAYPRICEINCVAT) !== parseFloat(item.Price)) cp.updateReq = true
        }
        if (item.Source === "MAGENTO" && mergeItem.QSPRICEINCVAT) {
            if (parseFloat(mergeItem.QSPRICEINCVAT) !== parseFloat(item.Price)) cp.updateReq = true
        }
        merge.get(item.ItemNumber)!.CP![item.Source] = cp
    }
    return merge
}