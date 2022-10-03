import * as mongoI from '../mongo-interface/mongo-interface'
import {ObjectId} from 'mongodb'
import {binarySearch} from "../core/core";
//import * as linn from "../linn-api/linn-api"
//import * as eod from '../workers/shop-worker-modules/endOfDayReport'

interface stockError {
    BRAND?: string
    TITLE: string
    SKU: string
    CHECKED: boolean
    QTY: number
    PRIORITY: boolean
}

export interface QuickLinks {
    _id?: string,
    id: string,
    links: QuickLinkItem[],
    updates?: QuickLinkItem[]
}

export interface QuickLinkItem {
    SKU: string | null,
    TITLE?: string,
    SHOPPRICEINCVAT?: string
}

export const get = async (query: object) => {
    return await mongoI.find<sbt.shopOrder>("Shop", query)
}

export const reports = async () => {
    return await mongoI.find<any>("Shop-Reports")
}

export const updateQuickLinks = async (data:QuickLinks) => {
    let query = data._id ? {_id: new ObjectId(data._id)} : {id: data.id}
    if (data._id) delete data._id
    return await mongoI.setData("Shop-Till-QuickLinks", query, data)
}

export const deleteQuickLinks = async (data:QuickLinks) => {
    let query = data._id ? {_id: new ObjectId(data._id)} : {id: data.id}
    if (data._id) delete data._id
    return await mongoI.deleteOne("Shop-Till-QuickLinks", query)
}

/*
export const shopSalesSpan = async () => {
    const result = await mongoI.findAggregate<eod.takings>("Shop-Reports", [
        {$sort: {date: 1}},
        {$group: {_id: null, first: {$first: '$$ROOT'}, last: {$last: '$$ROOT'}}},
        {$project: {first: {date: 1}, last: {date: 1}}}
    ])
    return result ? result[0] : null
}

export const shopSalesByMonth = async (firstDay: string, lastDay: string) => {
    return await mongoI.find<eod.takings>("Shop-Reports", {$and: [{date: {$gt: firstDay}}, {date: {$lt: lastDay}}]})
}

export const shopSalesMonthTotal = async (firstDay: string, lastDay: string) => {
    return await mongoI.findAggregate<eod.takings>("Shop-Reports", [
        {$match: {$and: [{date: {$gte: firstDay}}, {date: {$lte: lastDay}}]}},
        {$group: {_id: null, total: {$sum: "$transactions.total"}, totalProfit: {$sum: "$transactions.profit"}}}
    ])
}

export const shopSalesYearTotal = async (firstDay: string, lastDay: string) => {
    return await mongoI.findAggregate<eod.takings>("Shop-Reports", [
        {$match: {$and: [{date: {$gte: firstDay}}, {date: {$lte: lastDay}}]}},
        {$group: {_id: null, total: {$sum: "$transactions.total"}, totalProfit: {$sum: "$transactions.profit"}}}
    ])
}

export const profitAdjust = async (query: object, data: eod.takings) => {
    if (data._id !== undefined) {
        delete data._id
    }
    return await mongoI.setData("Shop-Reports", query, data)
}*/

export const orders = async (id: string) => {
    return await mongoI.find<any>("Shop", {"id": {$regex: id, $options: "i"}})
}

export const getQuickLinks = async () => {
    const query = [
        {
            '$match': {}
        }, {
            '$lookup': {
                'from': 'Items',
                'let': {
                    'sku': '$links.SKU'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$in': [
                                    '$SKU', '$$sku'
                                ]
                            }
                        }
                    }, {
                        '$project': {
                            'SKU': 1,
                            'SHOPPRICEINCVAT': 1,
                            'TITLE': 1
                        }
                    },
                    {
                        '$sort': {
                            'SKU': 1
                        }
                    }
                ],
                'as': 'updates'
            }
        }
    ]

    let result = await mongoI.findAggregate<QuickLinks>("Shop-Till-QuickLinks", query)
    for (let quickLinks of result!) {
        for (let index in quickLinks.links) {
            if(!quickLinks.links[index].SKU) continue
            let search = binarySearch<QuickLinkItem>(quickLinks.updates!, "SKU", quickLinks.links[index].SKU)
            if (search) quickLinks.links[index] = search
        }
        delete quickLinks.updates
    }
    return result
}

export const getSupplierPriceChanges = async (data: { supplier: string, data: string }) => {

    // Split on row
    let rows = data.data.split("\n");
    if (!rows) return

    // Get first row for column headers
    let headers = rows.shift()!.split(",");

    let json: {
        SKU: string,
        title?: string,
        "Retail Price": string
        "Retail Change": string
        "Purchase Price": string
        "Purchase Change": string
    }[] = []

    rows.forEach(rowCSV => {
        // Loop through each row
        let obj: { [key: string]: string } = {}
        let row = rowCSV.split(",")
        for (let i = 0; i < headers.length; i++) {
            obj[headers[i].replace(/\r?\n|\r/g, "")] = row[i] ? row[i].replace(/\r?\n|\r/g, "") : "";
        }
        // @ts-ignore
        json.push(obj);
    });

    let itemChanges = []

    const result = await mongoI.find<sbt.Item>("Items", {SUPPLIER: data.supplier})
    if (!result) return

    for (let item of result) {
        if (item.SKU.indexOf("-") !== -1) {
            let check = item.SKU.split("-")
            let pos = json.map(item => {
                return item.SKU
            }).indexOf(check[1])
            if (pos !== -1) {
                json[pos]["SKU"] = item.SKU
                json[pos]["title"] = item.TITLE
                json[pos]["Retail Change"] = (parseFloat(json[pos]["Retail Price"]) - parseFloat(String(item.RETAILPRICE!))).toFixed(2)
                json[pos]["Purchase Change"] = (parseFloat(json[pos]["Purchase Price"]) - parseFloat(String(item.PURCHASEPRICE!))).toFixed(2)
                itemChanges.push(json[pos])
            }
        }
    }

    return itemChanges
}
//only used in /pages/stock-reports
export const getIncorrectStock = async () => {
    console.dir("Get Incorrect Stock")
    const query = [
        {
            '$lookup': {
                'from': 'Items',
                'localField': 'SKU',
                'foreignField': 'SKU',
                'as': 'Item'
            }
        }, {
            '$unwind': {
                'path': '$Item'
            }
        }, {
            '$project': {
                'SKU': 1,
                'CHECKED': 1,
                'PRIORITY': 1,
                'QTY': 1,
                'TITLE': 1,
                'BRAND': '$Item.IDBEP.BRAND'
            }
        }
    ]
    return await mongoI.findAggregate<stockError>('Shop-Stock-Report', query);
}

export const deadStockReport = async () => {
    let tenMonths = new Date()
    tenMonths.setMonth(tenMonths.getMonth() - 10)

    let sixMonths = new Date()
    sixMonths.setMonth(sixMonths.getMonth() - 6)

    let threeMonths = new Date()
    threeMonths.setMonth(threeMonths.getMonth() - 3)

    async function mongoAggregate(from:Date) {
        let query = [
            {
                '$match':{'date': {'$gt': from.getTime().toString()}}
            }, {
                '$project': {
                    'items': {
                        '$objectToArray': '$items'
                    }
                }
            }, {
                '$unwind': {
                    'path': '$items',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$group': {
                    '_id': '',
                    'items': {
                        '$addToSet': '$items.k'
                    }
                }
            }
        ]
        let deadReport = await mongoI.findAggregate<{_id:string, items:string[]}>("Shop-Reports", query)
        return await mongoI.find<{ SUPPLIER: string, SKU: string, TITLE: string, SOLDFLAG?:number }>("Items", {
            SKU: {$nin: deadReport![0].items},
            STOCKTOTAL: {$gt: 0},
            IDBFILTER: "domestic"
        }, {SUPPLIER: 1, SKU: 1, TITLE: 1}, {SUPPLIER: 1})
    }

    let tenMonthDead = await mongoAggregate(tenMonths)
    let sixMonthDead = await mongoAggregate(sixMonths)
    let threeMonthDead = await mongoAggregate(threeMonths)

    let tempMap = new Map()
    for(const item of threeMonthDead!){
        item.SOLDFLAG = 3
        tempMap.set(item.SKU, item)
    }
    for(const item of sixMonthDead!) {
        if(tempMap.has(item.SKU)) tempMap.get(item.SKU).SOLDFLAG = 6
    }
    for(const item of tenMonthDead!) {
        if(tempMap.has(item.SKU)) tempMap.get(item.SKU).SOLDFLAG = 10
    }

    return Array.from(tempMap.values())
}