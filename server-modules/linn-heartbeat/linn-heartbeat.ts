"use strict"
import Linn = require('../linn-api/linn-api');
import mongoI = require('../mongo-interface/mongo-interface')

const {postToWorker} = require('../workers/worker');

interface mostRecentUpdate {
    RecentUpdates: {
        DATE: any
    }
}

interface SQLQueryResult {
    SKU:string
    DATE:string
}


export const init = async ()=>{
    await beat()
    setInterval(() => {
        console.log("Heartbeat")
        beat()
    }, 30000)
    return;
}

const beat = async () => {
    const status = (await mongoI.findOne<mostRecentUpdate>('HeartBeat', {ID: 'DBSTATUS'}, {}))
    if(!status) return
    await checkForItemUpdates(status)
    await checkForStockUpdates(status)
}

const checkForItemUpdates = async (current: mostRecentUpdate) => {

    const linnQuery = await Linn.getLinnQuery<SQLQueryResult>(
        `SELECT ItemNumber AS SKU,
                ModifiedDate AS 'DATE'
         FROM StockItem
         WHERE bLogicalDelete = 0
           AND ModifiedDate > '${current.RecentUpdates.DATE}'
         ORDER BY ModifiedDate DESC`
    )

    const UpdateItems = linnQuery.Results;
    if (!UpdateItems || UpdateItems.length <= 0) return;

    await logDataAndUpdateDBStatus(UpdateItems, "Item")
    await dbCleanUp()
    await postToWorker(
        "update",
        {type: "updateAll", data: { skus: skuList(UpdateItems) }, id: new Date().getTime()}
    )
    return;
}

const checkForStockUpdates = async (current: mostRecentUpdate) => {
    const linnQuery = await Linn.getLinnQuery<SQLQueryResult>(
        `SELECT si.ItemNumber AS 'SKU', sl.LastUpdateDate AS 'DATE'
         FROM [StockItem] si
             INNER JOIN [StockLevel] sl on si.pkStockItemId = sl.fkStockItemId
         WHERE bLogicalDelete = 0
           AND sl.LastUpdateDate > '${current.RecentUpdates.DATE}'
         ORDER BY sl.LastUpdateDate DESC`)

    const UpdateStock = linnQuery.Results;
    if (!UpdateStock || UpdateStock.length <= 0) return;

    await logDataAndUpdateDBStatus(UpdateStock, "Stock")
    await dbCleanUp()
    await postToWorker(
        "update",
        {type: "stockTotal", data: {skus: skuList(UpdateStock), save: true}, id: new Date().getTime()}
    )
    return;
}

const logDataAndUpdateDBStatus = async (data:SQLQueryResult[], type:string) => {
    for (let v of data) console.dir(v, { color: true, depth: 2 })
    console.log(`HB: ${type} Update Needed`)
    await mongoI.setData('HeartBeat', {ID: 'DBSTATUS'}, {RecentUpdates: data[0]})
}

const skuList = (data:SQLQueryResult[]) => {
    let list = ''
    for (let item of data) list === '' ? list = `'${item.SKU}'` : list += `,'${item.SKU}'`
    return list
}

// function to clean up local db, deleting any documents that arnt in the linnworks database
const dbCleanUp = async () => {
    console.log('DB clean run')
    const linnQuery = await Linn.getLinnQuery<{SKU:string}>(
        'SELECT ItemNumber AS SKU FROM StockItem WHERE (bLogicalDelete = 0 OR IsVariationGroup = 1)'
    )

    const data = linnQuery.Results;
    const skuList = data.map( e => { return e.SKU })

    const result = await mongoI.find<{ SKU: string }>("Items", {ID: {$ne: 'DBSTATUS'}}, {SKU: 1})
    if(!result) return

    for (let value of result) {
        if (skuList.indexOf(value.SKU) === -1) await mongoI.deleteOne("Items", {SKU: value.SKU})
    }
}

