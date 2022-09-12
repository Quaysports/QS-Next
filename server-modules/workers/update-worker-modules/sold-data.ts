import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";
import mongoI = require("../../mongo-interface/mongo-interface");

interface months {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
}

export const soldData = async (merge = (new Map<string, sbt.Item>()), skus?: string) => {
    await auth(true)
    console.log("querying sold data!")
    console.log(new Date())

    merge ??= new Map<string, sbt.Item>()

    let query
    if (skus) {
        query = {
            SKU: {
                $in: skus.replace(/'/g, "").split(",")
            },
            ISCOMPOSITE: false
        }
    } else {
        query = { ISCOMPOSITE: false }
    }

    const result = await mongoI.find<sbt.Item>("Items", query, {SKU: 1})
    if(!result) return

    let skuList = ''
    for (let v of result) skuList === '' ? skuList = `'${v.SKU}'` : skuList += `,'${v.SKU}'`

    let cy = new Date().getFullYear()
    let yearString = `'${cy}','${cy - 1}','${cy - 2}','${cy - 3}','${cy - 4}'`

    function queryString(years:string) {
        return `SELECT 'SKU' = si.ItemNumber,
                       'Month' = MONTH (o.dProcessedOn),
                        'Year' = YEAR(o.dProcessedOn),
                        'Qty' = SUM(oi.nqty)
                FROM
                    [Order] o
                    INNER JOIN OrderItem oi
                on o.pkOrderID = oi.fkOrderID
                    INNER JOIN StockItem si on si.pkstockItemId = oi.fkStockItemID_processed
                WHERE
                    YEAR (o.dProcessedOn) IN (${years})
                  AND si.bLogicalDelete = 0
                  AND si.bContainsComposites = 0 ${skus ? "AND si.ItemNumber IN (" + skus + ")" : ""}
                GROUP BY
                    si.ItemNumber, MONTH (o.dProcessedOn), YEAR (o.dProcessedOn)
                ORDER BY
                    SKU ASC`
    }

    interface SQLQuery {SKU:string,Month:keyof months,Year:number,Qty:string}

    const linnData = (await Linn.getLinnQuery<SQLQuery>(queryString(yearString))).Results

    if (linnData.length > 0) {
        for (let item of linnData) {
            if (!merge.has(item.SKU)) merge.set(item.SKU, {SKU: item.SKU})
            let mergeItem = merge.get(item.SKU)!
            mergeItem.MONTHSTOCKHIST ??= {}
            mergeItem.MONTHSTOCKHIST![item.Year] ??= {
                1: "0",
                2: "0",
                3: "0",
                4: "0",
                5: "0",
                6: "0",
                7: "0",
                8: "0",
                9: "0",
                10: "0",
                11: "0",
                12: "0"
            } as months
            merge.get(item.SKU)!.MONTHSTOCKHIST![item.Year][item.Month] = item["Qty"]
        }
    }
    return merge
}