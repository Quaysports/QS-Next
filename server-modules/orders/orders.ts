import * as mongoI from '../mongo-interface/mongo-interface';
import * as Linn from '../linn-api/linn-api';
import {OnlineSalesReport} from "../workers/shop-worker-modules/onlineSalesReport";

import { processNewOrder } from "./processNewOrder";

let lastUpdate: Date

export interface LinnOrdersSQLResult{
    name: string
    email: string
    postcode: string
    date: string
    id: string
    source: string
    postalid: string
    extRef: string
    tracking: string
    address1: string
    address2: string
    address3: string
    town: string
    region: string
    phone: string
    price: string
    unitPrice: string
    sku: string
    qty: string
    weight: string
    packaging: string
    packagingWeight: string
    composite: string
}

export const init = async () => {
    await linnGet()
    setInterval(() => { linnGet() }, 180000)
}

export const linnGet = async () => {
    let queryDate = await mongoI.findOne<any>("Orders", {lastUpdate: {$exists: true}})

    let sqlDate = new Date(queryDate.lastUpdate)
    let sqlDateString = sqlDate.toISOString().slice(0, 19).toString().replace('T', ' ')

    let qResult = await Linn.getLinnQuery<LinnOrdersSQLResult>(
        `SELECT 
                o.cFullName AS 'name', 
                o.cEmailAddress AS 'email', 
                o.cPostCode AS 'postcode', 
                o.dProcessedOn AS 'date', 
                o.nOrderId AS 'id', 
                o.Source AS 'source', 
                o.fkPostalServiceId AS 'postalid', 
                o.ExternalReference AS 'extRef', 
                o.PostalTrackingNumber AS 'tracking', 
                o.Address1 AS 'address1', 
                o.Address2 AS 'address2', 
                o.Address3 AS 'address3', 
                o.Town AS 'town', 
                o.Region AS 'region', 
                o.BuyerPhoneNumber AS 'phone', 
                o.fTotalCharge AS 'price', 
                oi.fPricePerUnit AS 'unitPrice', 
                si.ItemNumber AS 'sku', 
                oi.nQty AS 'qty', 
                si.Weight AS weight,
                pt.PackageTitle AS packaging,
                pt.PackagingWeight AS packagingWeight,
                si.bContainsComposites AS 'composite'
         FROM [Order] o
             INNER JOIN OrderItem oi ON o.pkOrderID = oi.fkOrderID
             INNER JOIN PackageGroups pg ON o.fkPackagingGroupId = pg.PackageCategoryID
             INNER JOIN PackageTypes pt ON pg.PackageCategoryID = pt.PackageGroupID
             INNER JOIN StockItem si on oi.fkStockItemId_processed = si.pkStockItemID
         WHERE
             Convert (DATETIME, o.dProcessedOn) >= Convert (DATETIME, '${sqlDateString}')
           AND
             o.Source <> 'Shop'
         ORDER BY o.nOrderId`
    )

    let data = qResult.Results
    if (data.length > 0) await processNewOrder(data)

    lastUpdate = new Date()
    await mongoI.setData("Orders", {lastUpdate: {$exists: true}}, {lastUpdate: lastUpdate})
    return
}

export const get = async (query:object) => {
    return await mongoI.findOne<sbt.OnlineOrder>("Orders", query)
}

export const update = async (item:sbt.OnlineOrder) => {
    if (item._id !== undefined) delete item._id
    await mongoI.setData("Orders", {id: item.id}, item)
    return {done: true}
}

export const compare = async (data: { orderId: string; weight: number; }) => {
    const order = await get({tracking: data.orderId})
    if(!order) return
    return await processItem(order, data.weight)
}

export const onlineSalesSpan = async () => {
    const result = await mongoI.findAggregate<OnlineSalesReport>("Online-Reports", [
        {$group: {_id: null, first: {$first: '$$ROOT'}, last: {$last: '$$ROOT'}}},
        {$project: {first: {date: 1}, last: {date: 1}}}
    ])
    return result ? result[0] : null
}

export const onlineSalesYearTotal = async (firstDay:string, lastDay:string) => {
    return await mongoI.findAggregate<OnlineSalesReport>("Online-Reports", [
        {$match: {$and: [{date: {$gte: firstDay}}, {date: {$lte: lastDay}}]}},
        {
            $group: {
                _id: null,
                total: {$sum: {$add: ["$transactions.ebay", "$transactions.amazon", "$transactions.quaysports"]}},
                totalProfit: {$sum: "$transactions.profit"}
            }
        }
    ])
}

export const onlineSalesMonthTotal = async (firstDay:string, lastDay:string) => {
    return await mongoI.findAggregate<OnlineSalesReport>("Online-Reports", [
        {$match: {$and: [{date: {$gte: firstDay}}, {date: {$lte: lastDay}}]}},
        {
            $group: {
                _id: null,
                amazon: {$sum: "$transactions.amazon"},
                ebay: {$sum: "$transactions.ebay"},
                quaySports: {$sum: "$transactions.quaysports"},
                total: {$sum: {$add: ["$transactions.ebay", "$transactions.amazon", "$transactions.quaysports"]}},
                totalProfit: {$sum: "$transactions.profit"}
            }
        }
    ])
}

export const onlineSalesByMonth = async (firstDay:string, lastDay:string) => {
    return await mongoI.find<OnlineSalesReport>("Online-Reports", {$and: [{date: {$gt: firstDay}}, {date: {$lt: lastDay}}]})
}

const processItem = async (order:sbt.OnlineOrder, weight: number) => {
    if (!order) {
        return {status: false, lastUpdate: lastUpdate}
    }

    const minMulti = order.totalWeight > 2000 ? 0.99 : 0.98;
    const maxMulti = order.totalWeight > 2000 ? 1.01 : 1.02;
    order.scanned = {
        time: new Date(),
        scaleWeight: weight,
        correct: false,
        min: order.totalWeight * minMulti,
        max: order.totalWeight * maxMulti,
        diff: weight - order.totalWeight,
        per: (100 / order.totalWeight) * (weight - order.totalWeight)
    }
    if (weight >= order.scanned.min && weight <= order.scanned.max) {
        order.scanned.correct = true
    }

    if (order._id !== undefined) delete order._id

    await mongoI.setData("Orders", {id: order.id}, order)
    return {status: true, order: order}
}