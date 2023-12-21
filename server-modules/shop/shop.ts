import * as mongoI from '../mongo-interface/mongo-interface'
import {ObjectId} from 'mongodb'
import {schema} from "../../types";
import {find, findAggregate} from "../mongo-interface/mongo-interface";
import {number, string} from "prop-types";
//import * as linn from "../linn-api/linn-api"
//import * as eod from '../workers/shop-worker-modules/endOfDayReport'

/**
 * @property {string} [BRAND]
 * @property {string} TITLE
 * @property {string} SKU
 * @property {boolean} CHECKED
 * @property {number} QTY
 * @property {boolean} PRIORITY
 */
export interface StockError {
    brand?: string
    title: string
    SKU: string
    checked: boolean
    quantity: number
    priority: boolean
}

export type QuickLinks = {
    _id?: string
    id: string
    links: string[]
    data: QuickLinkItem[]
}

export type QuickLinkItem = Pick<schema.Item, "SKU" | "title" | "prices" | "till">

export interface PickListItem extends Pick<schema.Item, "SKU" | "title" | "stock" | "tags"> { quantity:number }

export const get = async (query: object) => {
    return await mongoI.find<schema.TillOrder>("Shop", query)
}

export const reports = async () => {
    return await mongoI.find<any>("Shop-Reports")
}

export const updateQuickLinks = async (data:QuickLinks) => {
    let query = data._id ? {_id: new ObjectId(data._id)} : {id: data.id}
    if (data._id) delete data._id
    return await mongoI.setData("Till-QuickLinks", query, data)
}

export const deleteQuickLinks = async (data:QuickLinks) => {
    let query = data._id ? {_id: new ObjectId(data._id)} : {id: data.id}
    if (data._id) delete data._id
    return await mongoI.deleteOne("Till-QuickLinks", query)
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
    const query = [{
        '$match': {}
    }, {
        '$lookup': {
            'from': 'New-Items',
            'let': {
                'sku': '$links'
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
                        'prices': 1,
                        'title': 1,
                        'till': 1
                    }
                },
                {
                    '$sort': {
                        'SKU': 1
                    }
                }
            ],
            'as': 'data'
        }
    }]

    return await mongoI.findAggregate<QuickLinks>("Till-QuickLinks", query)
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

    const result = await mongoI.find<schema.Item>("Items", {SUPPLIER: data.supplier})
    if (!result) return

    for (let item of result) {
        if (item.SKU.indexOf("-") !== -1) {
            let check = item.SKU.split("-")
            let pos = json.map(item => {
                return item.SKU
            }).indexOf(check[1])
            if (pos !== -1) {
                json[pos]["SKU"] = item.SKU
                json[pos]["title"] = item.title
                json[pos]["Retail Change"] = (parseFloat(json[pos]["Retail Price"]) - parseFloat(String(item.prices.retail!))).toFixed(2)
                json[pos]["Purchase Change"] = (parseFloat(json[pos]["Purchase Price"]) - parseFloat(String(item.prices.purchase!))).toFixed(2)
                itemChanges.push(json[pos])
            }
        }
    }

    return itemChanges
}
//only used in /pages/stock-reports
export const getIncorrectStock = async () => {
    const query = [
        {
            '$lookup': {
                'from': 'New-Items',
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
                'checked': 1,
                'priority': 1,
                'quantity': 1,
                'title': 1,
                'brand': '$Item.brand'
            }
        }
    ]
    return await mongoI.findAggregate<StockError>('Shop-Stock-Report', query);
}
/**
 * Dead Stock Object
 * @property {string} SUPPLIER
 * @property {string} SKU
 * @property {string} TITLE
 * @property {number} SOLDFLAG
 */
export interface DeadStockReport {
    SUPPLIER: string,
    SKU: string,
    TITLE: string,
    SOLDFLAG: number
}

export const deadStockReport = async ():Promise<DeadStockReport[]> => {
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

        if(!deadReport || deadReport.length === 0) return []

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
    if(threeMonthDead) {
        for (const item of threeMonthDead) {
            item.SOLDFLAG = 3
            tempMap.set(item.SKU, item)
        }
    }
    if(sixMonthDead) {
        for (const item of sixMonthDead) {
            if (tempMap.has(item.SKU)) tempMap.get(item.SKU).SOLDFLAG = 6
        }
    }
    if(tenMonthDead) {
        for (const item of tenMonthDead) {
            if (tempMap.has(item.SKU)) tempMap.get(item.SKU).SOLDFLAG = 10
        }
    }

    return Array.from(tempMap.values())
}

export async function getPickList(date:number){

    let selectedDate = new Date(date)
    let startDate = selectedDate.getTime()
    selectedDate.setDate(selectedDate.getDate() + 1)
    let endDate = selectedDate.getTime()

    let query = [
        {
            '$match': {
                'transaction.date':{
                    '$gt': startDate.toString(),
                    '$lt': endDate.toString()
                }
            }
        }, {
            '$unwind': {
                'path': '$items'
            }
        }, {
            '$lookup': {
                'from': 'New-Items',
                'localField': 'items.SKU',
                'foreignField': 'SKU',
                'as': 'item'
            }
        }, {
            '$unwind': {
                'path': '$item'
            }
        }, {
            '$group': {
                '_id': {
                    'SKU': '$items.SKU',
                    'title': '$items.title',
                    'stock': '$item.stock',
                    'tags': '$item.tags'
                },
                'quantity': {
                    '$sum': '$items.quantity'
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'SKU': '$_id.SKU',
                'title': '$_id.title',
                'stock': '$_id.stock',
                'tags': '$_id.tags',
                'quantity': 1
            }
        },
        {
            '$sort': {'SKU': 1}
        }
    ]

    let orders = await findAggregate<PickListItem>("Till-Transactions", query)

    if(!orders) return []

    return orders
}

export async function getTillTransactionCSVData(dates: { start: number, end: number }, isBait: boolean, baitList: string[]) {
    const baseQuery = {
      $and: [
        { paid: true },
        { 'transaction.date': { $gt: dates.start.toString(), $lt: dates.end.toString() } },
      ],
    };
  
    const baitListSpacesRemoved: string[] = baitList ? baitList.filter(Boolean).map(bait => bait.trim()) : [];
    const orConditionsForBait: object[] = baitListSpacesRemoved.map(bait => ({ $eq: ['$$item.SKU', bait] }));

    let baitQuery = [
        {
            '$match': {
                'transaction.date': { $gt: dates.start.toString(), $lt: dates.end.toString() },
                paid: true,
                'items.SKU': { $in: baitListSpacesRemoved }
            }
        },
        {
            '$project': {
                grandTotal: 1,
                transaction: 1,
                paid: 1,
                id: 1,
                items: {
                    $map: {
                    input: {
                        $filter: {
                        input: '$items',
                        as: 'item',
                        cond: { $or: orConditionsForBait },
                        },
                    },
                    as: 'filteredItem',
                    in: {
                        total: '$$filteredItem.total',
                        SKU: '$$filteredItem.SKU',
                        Title: '$$filteredItem.Title',
                    },
                    },
                },
            }
        }
    ]
    const databaseCollection = "Till-Transactions"
    if (isBait) {
        console.dir(baitQuery, { depth: 5 });
        return await findAggregate<schema.TillOrder>(databaseCollection, baitQuery)
    } else {
        console.dir(baseQuery, { depth: 5 });
        return await find<schema.TillOrder>(databaseCollection, baseQuery);
    }
  }  

export type GiftCardType = {
    sort(arg0: (a: any, b: any) => number): any;
    id: string
    active:boolean
    amount:number
}
export async function getGiftCards() {
    let giftCardInfo = await find<GiftCardType>('New-Giftcards')
    return giftCardInfo ? giftCardInfo : []
    
}

export type brandNameType ={
    brand: ''
}

export async function brandNameType() {
    let giftCardInfo = await find<brandNameType>('New-Giftcards')
    return giftCardInfo ? giftCardInfo : []
    
}