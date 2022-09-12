import mongoI = require('../mongo-interface/mongo-interface');
import {auth} from "../linn-api/linn-auth";
import {endOfDayReport} from "./shop-worker-modules/endOfDayReport";
import {onlineSalesReport} from "./shop-worker-modules/onlineSalesReport";
import {deadStockReport} from "./shop-worker-modules/deadStockReport";

const {parentPort} = require("worker_threads");

auth(true).then(() => {
    parentPort.on("message", async (req: sbt.workerReq) => {
        parentPort.postMessage({msg: `${req.type} Shop Worker Started!`});
        switch (req.type) {
            case "endOfDayReport": return parentPort.postMessage(
                    createChannelMessage(req, await runEndOfDayReport())
                );
            case "onlineSalesReport": return parentPort.postMessage(
                    createChannelMessage(req, await runOnlineSalesReport())
                );
            case "deadStock": return parentPort.postMessage(
                    createChannelMessage(req, await runDeadStockReport())
                );
            case "getCustomItemReport": return parentPort.postMessage(
                    createChannelMessage(req, await runCustomItemReport(req.data))
                );
            default: return
        }
    });
})

const createChannelMessage = (req:sbt.workerReq, data = {}) => {
    console.log(req.type)
    return {
        type: req.type,
        id: req.id,
        msg: `${req.type} worker done`,
        data: data
    }
}

const runEndOfDayReport = async () => { return await endOfDayReport() }

const runOnlineSalesReport = async () => { return await onlineSalesReport() }

const runDeadStockReport = async () => { return await deadStockReport() }

const runCustomItemReport = async (data: any) => {
    return await mongoI.find<any>("Shop", {
    'order.EAN': {
        '$regex': new RegExp('EAN')
    },
    'transaction.date': {$gt: data.date}
}) }
