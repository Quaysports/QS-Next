import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";

export const stockTotal = async (merge = (new Map<string, sbt.Item>()), skus?: string) => {
    await auth(true)

    console.log("querying stocktotal data!")
    console.log(new Date())

    let query = `SELECT si.ItemNumber        AS SKU,
                        si.PurchasePrice     AS PP,
                        sl.Quantity          AS QTY,
                        CASE
                            WHEN sl.fkStockLocationId = '00000000-0000-0000-0000-000000000000' then 'YELLAND'
                            WHEN sl.fkStockLocationId = '1a692c39-afc9-4844-9f11-6e6625a9c1f1' then 'WAREHOUSE'
                            ELSE ''
                            END              AS LOCATION,
                        SUM(sl.MinimumLevel) AS MINSTOCK
                 FROM [StockItem] si
                     INNER JOIN [StockLevel] sl on si.pkStockItemId = sl.fkStockItemId
                 WHERE sl.fkStockLocationId in ('00000000-0000-0000-0000-000000000000', '1a692c39-afc9-4844-9f11-6e6625a9c1f1')
                   AND si.bLogicalDelete = 0 ${skus ? "AND si.ItemNumber IN (" + skus + ")" : ""}
                 GROUP BY si.ItemNumber, sl.Quantity, si.PurchasePrice, sl.fkStockLocationId`

    interface SQLQuery  { SKU: string, PP: string, QTY: string, LOCATION: string, MINSTOCK: string }

    const linnData = (await Linn.getLinnQuery<SQLQuery>(query)).Results

    for (let item of linnData) {
        let qty = parseFloat(item.QTY)
        let pp = parseFloat(item.PP)

        if (!merge.has(item.SKU)) merge.set(item.SKU, {SKU: item.SKU})
        let mergeItem = merge.get(item.SKU)!

        if (!mergeItem.STOCKINFO) mergeItem.STOCKINFO = {
            YELLAND: 0,
            WAREHOUSE: 0
        }

        if (!mergeItem.STOCKTOTAL) mergeItem.STOCKTOTAL = 0
        if (!mergeItem.STOCKVAL) mergeItem.STOCKVAL = 0

        if (item["LOCATION"] === 'YELLAND') {
            mergeItem.STOCKINFO.YELLAND = qty
            mergeItem.MINSTOCK = parseFloat(item.MINSTOCK)
            mergeItem.STOCKTOTAL += qty
            if (pp > 0 && qty > 0) mergeItem.STOCKVAL += qty * pp
        }
        if (item["LOCATION"] === 'WAREHOUSE') {
            mergeItem.STOCKINFO.WAREHOUSE = qty
            mergeItem.STOCKTOTAL += qty
            if (pp > 0 && qty > 0) mergeItem.STOCKVAL += qty * pp
        }
    }
    return merge
}
