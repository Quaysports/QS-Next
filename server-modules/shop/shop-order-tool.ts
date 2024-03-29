import * as mongoI from '../mongo-interface/mongo-interface';
import * as linn from "../linn-api/linn-api";
import {schema} from "../../types";
export interface shopOrder {
    _id?: string
    arrived: orderObject[]
    complete: boolean
    date: number
    id: string
    price: number
    order: orderObject[]
    supplier: string
    completedBy:string
}
export interface orderObject {
    brand:string
    stock: schema.Stock
    SKU: string
    title: string
    supplier: string
    _id: string
    bookedIn?: string
    quantity: number
    tradePack: number
    arrived?: number
    prices: {purchase: number}
    deadStock?: boolean
    newProduct?: boolean
    lowStock?: boolean
    submitted: boolean
    soldFlag: number
    onOrder?: boolean
}

export const getLowStock = async () => {
    return await mongoI.find<schema.Item>("New-Items",
        {tags: {$in:["domestic"]}, "stock.minimum": {$gt: 0}, $expr: {$lt: ["$stock.total", "$stock.minimum"]}},
        {title: 1, SKU: 1, "stock.total": 1, "prices.purchase":1, "stock.minimum": 1, supplier: 1, brand: 1})
}
export const shopStockOrder = async (order:shopOrder) => {
    if (order._id !== undefined) delete order._id
    return await mongoI.setData("Shop-Orders", {date: order.date}, order)
}

export const getCompleteOrders = async (start:object = {}, end:object = {}, supplier:object = {}) => {
    const result =  await mongoI.find<shopOrder>("New-New-Shop-Orders", {$and: [start, end, supplier, {complete: {$eq: true}}]}, {}, {supplier:1})
    return result ? result : []
}

export const getOpenOrders = async () => {
    const result = await mongoI.find<shopOrder>("New-New-Shop-Orders", {complete: false})
    return result ? result : []
}

export const updateStock = async (skus:string) => {
    return await linn.getLinnQuery<{ItemNumber:string,Quantity:string,MinimumLevel:string}>(
        `SELECT si.ItemNumber,
                sl.Quantity,
                sl.MinimumLevel
         FROM [StockItem] si
             INNER JOIN [StockLevel] sl
         on si.pkStockItemId = sl.fkStockItemId
         WHERE sl.fkStockLocationId in ('00000000-0000-0000-0000-000000000000')
           AND si.ItemNumber IN (${skus})`)
}
export const adjustStock =  async (arr:{SKU:string,quantity:string}[], id:string) => {
    let stockData = []
    for (let item of arr) {
        let details = {
            "SKU": item.SKU,
            "LocationId": "00000000-0000-0000-0000-000000000000",
            "Level": item.quantity
        }
        stockData.push(details)
    }
    return await linn.adjustStock(stockData, id)
}

export const getBrandsForSupplier = async (supplier:string) => {
    return await mongoI.findDistinct("New-Items", "brand", {supplier:supplier})
}
export interface SupplierLowStock {
    _id:string,
    supplier:string,
    lowStockCount:number
}
export const getSuppliersAndLowStock = async () => {
    const query = [
        {
            '$match': {
                'tags': {
                    '$in': [
                        'domestic'
                    ]
                },
                'isListingVariation': false,
                'isComposite': false
            }
        }, {
            '$group': {
                '_id': '$supplier',
                'lowStockCount': {
                    '$sum': {
                        '$cond': [
                            {
                                '$lt': [
                                    '$stock.total', '$stock.minimum'
                                ]
                            }, 1, 0
                        ]
                    }
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'supplier': '$_id',
                'lowStockCount': 1
            }
        }, {
            '$sort': {
                'supplier': 1
            }
        }
    ]
    const result = await mongoI.findAggregate<SupplierLowStock>("New-Items", query)
    return result ? result : []
}
export type SupplierItem = Pick<schema.Item, "SKU" | "title" | "brand" | "stock" | "prices">
export const getSupplierItems = async (supplier:string) => {
    let result = await mongoI.find<SupplierItem>("New-Items", {supplier: supplier, tags: {"$in":["domestic"]}}, {SKU: 1, title: 1, brand: 1, stock:1, prices:1},{SKU:1})
    for(const item of result!){
        if(item.stock.tradePack === undefined){
            console.log(item.SKU)
        }
    }
    return result ? result : []
}