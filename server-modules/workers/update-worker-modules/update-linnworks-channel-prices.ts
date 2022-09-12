import mongoI = require("../../mongo-interface/mongo-interface");
import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";
import {guid} from "../../core/core";
import {getLinnworksChannelPrices} from "./get-linnworks-channel-prices";

export const updateLinnworksChannelPrices = async (merge = (new Map<string, sbt.Item>())) => {
    await auth(true)

    const results = await mongoI.find<sbt.Item>("Items",
        {$or: [{"CP.EBAY.updateReq": true}, {"CP.AMAZON.updateReq": true}, {"CP.MAGENTO.updateReq": true}]},
        {SKU: 1, LINNID: 1, CP: 1, EBAYPRICEINCVAT: 1, QSPRICEINCVAT: 1, AMZPRICEINCVAT: 1}
    )

    if(!results) return

    let updates = new Map<string, object[]>([
        ["//api/Inventory/UpdateInventoryItemPrices", []],
        ["//api/Inventory/CreateInventoryItemPrices", []]
    ])

    let skuList = ''

    for (let item of results) {
        skuList === '' ? skuList = `'${item.SKU}'` : skuList += `,'${item.SKU}'`

        for (let channel in item.CP) {
            if (!merge.has(item.SKU)) merge.set(item.SKU, item)
            if (item.CP[channel].updateReq) {
                if (channel === "AMAZON" && item.AMZPRICEINCVAT) {
                    addPriceToUpdateMap(updates,'AMAZON', 'Silver Bullet Trading Ltd', item.AMZPRICEINCVAT.toString(), item.LINNID!, item.CP[channel].ID)
                }
                if (channel === "EBAY" && item.EBAYPRICEINCVAT) {
                    addPriceToUpdateMap(updates,'EBAY', 'EBAY1_UK', item.EBAYPRICEINCVAT.toString(), item.LINNID!, item.CP[channel].ID)
                }
                if (channel === "MAGENTO" && item.QSPRICEINCVAT) {
                    addPriceToUpdateMap(updates,'MAGENTO', 'http://quaysports.com', item.QSPRICEINCVAT.toString(), item.LINNID!, item.CP[channel].ID)
                }
            }
        }
    }

    await batchUpdateFromMap(Linn, updates)

    console.log("updating channel prices")
    return await mongoI.bulkUpdateItems(await getLinnworksChannelPrices(merge, skuList))
}

function addPriceToUpdateMap(map: Map<string, object[]>, source: string, subsource: string, price: string, linnid: string, id?: string) {
    if (id) {
        map.get("//api/Inventory/UpdateInventoryItemPrices")!.push({
            pkRowId: id,
            Source: source,
            SubSource: subsource,
            Price: price,
            UpdateStatus: 0,
            Tag: '',
            Rules: [],
            StockItemId: linnid
        })
    } else {
        map.get("//api/Inventory/CreateInventoryItemPrices")!.push({
            pkRowId: guid(),
            Source: source,
            SubSource: subsource,
            Price: price,
            StockItemId: linnid
        })
    }
}

const batchUpdateFromMap = async (Linn: typeof import("../../linn-api/linn-api"), updates:Map<string,object[]>) => {
    for(const [path, array] of updates){
        if(array.length === 0) continue
        console.log("updating "+path+" "+ array.length)
        for (let i = 0; i < array.length; i += 250) {
            await Linn.updateLinnItem(path, `inventoryItemPrices=${JSON.stringify(array.slice(i, i + 250))}`)
        }
    }
    return
}
