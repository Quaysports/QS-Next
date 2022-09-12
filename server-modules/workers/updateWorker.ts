import mongoI = require("../mongo-interface/mongo-interface");
import Postage = require('../postage/postage');
import Packaging = require('../packaging/packaging');

import {UpdateItems} from "./update-worker-modules/update-items";
import {extendedProperties} from "./update-worker-modules/extended-properties";
import {soldData} from "./update-worker-modules/sold-data";
import {stockTotal} from "./update-worker-modules/stock-total";
import {updateSuppliers} from "./update-worker-modules/update-suppliers";
import {marginUpdate} from "./update-worker-modules/margin-update";
import {updateChannelData} from "./update-worker-modules/update-channel-data";
import {updateLinnworksChannelPrices} from "./update-worker-modules/update-linnworks-channel-prices";
import {getLinnworksChannelPrices} from "./update-worker-modules/get-linnworks-channel-prices";
import {updateAllImages} from "./update-worker-modules/update-all-images";
import {pullAllLinnworksItemDescriptions} from "./update-worker-modules/pull-all-linnworks-item-descriptions"

const {parentPort} = require("worker_threads")

const websocketMessage = (type: string, message: object, socket?: string) => {
    if (socket) parentPort.postMessage({type: "socket", id: type, socket: socket, msg: message});
}

parentPort.on("message", async (req: sbt.workerReq) => {
    parentPort.postMessage({msg: `${req.type} Update Worker Started!`});
    switch (req.type) {
        case "stockTotal":
            return parentPort.postMessage(
                createChannelMessage(req, await runUpdateStockTotals(req))
            );
        case "updateAllImages":
            return parentPort.postMessage(
                createChannelMessage(req, await runUpdateAllImages(req))
            );
        case "extendedProperties":
            return parentPort.postMessage(
                createChannelMessage(req, await runUpdateExtendedProperties(req))
            );
        case "updateLinnChannelPrices":
            return parentPort.postMessage(
                createChannelMessage(req, await runUpdateLinnChannelPrices())
            )
        case "channelPrices":
            return parentPort.postMessage(
                createChannelMessage(req, await runChannelPrices(req))
            )
        case "pullAllLinnworksItemDescriptions":
            return parentPort.postMessage(
                createChannelMessage(req, await runPullAllLinnworksItemDescriptions())
            )
        case "updateAll":
            return parentPort.postMessage(
                createChannelMessage(req, await runUpdateAll(req))
            )
        default:
            return
    }
});

const createChannelMessage = (req: sbt.workerReq, data = {}) => {
    console.log(req.type)
    return {
        type: req.type,
        id: req.id,
        msg: `${req.type} worker done`,
        data: data
    }
}

const runUpdateStockTotals = async (req: sbt.workerReq) => {
    const merge = await stockTotal(undefined, req.data.skus)
    if (req.data.save) await mongoI.bulkUpdateItems(merge)
    return merge;
}

const runUpdateAllImages = async (req: sbt.workerReq) => {
    const result = await mongoI.find<sbt.Item>("Items",
        {LINNID: {$exists: true}, LISTINGVARIATION: false},
        {SKU: 1, ISCOMPOSITE: 1})

    if (!result) return
    const merge = new Map<string, sbt.Item>(result.map(item => [item.SKU, item]))

    websocketMessage("loading", {M: "Updating All Images"}, req.data.socket)
    const mergeReturn = await updateAllImages(merge)
    websocketMessage("loading", {M: "Update Complete", D: true}, req.data.socket)
    return await mongoI.bulkUpdateItems(mergeReturn)
}

const runPullAllLinnworksItemDescriptions = async () => {
    return await pullAllLinnworksItemDescriptions()
}

const runUpdateExtendedProperties = async (req: sbt.workerReq) => {
    const merge = await extendedProperties(req.data.skus)
    return await mongoI.bulkUpdateItems(merge)
}

const runUpdateLinnChannelPrices = async () => {
    return await updateLinnworksChannelPrices()
}

const runChannelPrices = async (req: sbt.workerReq) => {
    const merge = await marginUpdate(await getLinnworksChannelPrices(undefined, req.data.skus), req.data.skus)
    await mongoI.bulkUpdateItems(merge)
    return merge.size > 1 ? merge : merge.get(req.data.skus!);
}

const runUpdateAll = async (req: sbt.workerReq) => {
    let start = new Date()
    websocketMessage("loading", {M: "Updating All"}, req.data.socket)
    let merge = await UpdateItems(req.data.skus)

    websocketMessage("loading", {M: "Updating Sold Data"}, req.data.socket)
    let soldDataMerge = await soldData(merge, req.data.skus)

    websocketMessage("loading", {M: "Updating Stock Totals"}, req.data.socket)
    let stockTotalMerge = await stockTotal(soldDataMerge, req.data.skus)

    websocketMessage("loading", {M: "Updating Suppliers"}, req.data.socket)
    let suppliersMerge = await updateSuppliers(stockTotalMerge, req.data.skus)

    websocketMessage("loading", {M: "Channel Data"}, req.data.socket)
    let channelDataMerge = await updateChannelData(suppliersMerge, req.data.skus)

    websocketMessage("loading", {M: "Channel Prices"}, req.data.socket)
    let channelPricesMerge = await getLinnworksChannelPrices(channelDataMerge, req.data.skus)

    websocketMessage("loading", {M: "Updating Margin Calculations"}, req.data.socket)
    let marginUpdateMerge = await marginUpdate(channelPricesMerge, req.data.skus)

    websocketMessage("loading", {M: "Saving to Database"}, req.data.socket)
    let result = await mongoI.bulkUpdateItems(marginUpdateMerge, websocketMessage, req.data.socket)

    await Packaging.updateAll()
    await Postage.updateAll()

    let finish = new Date()
    console.log("Update all complete!")
    console.log("Start: " + start)
    console.log("Finish: " + finish)
    console.log("Total: " + (finish.getTime() - start.getTime()) / 1000)
    websocketMessage("loading", {M: "Update Complete", D: true}, req.data.socket)
    return result
}
