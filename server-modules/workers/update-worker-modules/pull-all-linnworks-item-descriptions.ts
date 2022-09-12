import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";

import mongoI = require("../../mongo-interface/mongo-interface");

export const pullAllLinnworksItemDescriptions = async () => {
    await auth(true)

    let merge = new Map<string, sbt.Item>()

    let query = `SELECT si.ItemNumber  AS SKU,
                        sd.Description AS DESCRIPTION
                 FROM StockItem si
                          INNER JOIN StockItem_Descriptions sd ON si.pkStockItemID = sd.fkStockItemId
                 WHERE si.bLogicalDelete = 'false'`

    let linnworksItems = (await Linn.getLinnQuery<{SKU:string,DESCRIPTION:string}>(query)).Results

    let databaseItems = await mongoI.find<{SKU:string,DESCRIPTION:string}>("Items", {}, {SKU: 1, DESCRIPTION: 1})
    if(!databaseItems) return merge

    for (let item of linnworksItems) {
        if (!item.DESCRIPTION) continue

        let pos = databaseItems.map(DBItem=>{return DBItem.SKU}).indexOf(item.SKU)
        if (pos === -1) continue

        if (databaseItems[pos].DESCRIPTION?.length > item.DESCRIPTION.length / 2) continue

        merge.set(item.SKU, {SKU: item.SKU, DESCRIPTION: item.DESCRIPTION})
    }

    if (merge.size > 1) {
        await mongoI.bulkUpdateItems(merge)
        return merge
    }
}