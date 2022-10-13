import * as mongoI from '../mongo-interface/mongo-interface';
import * as linn from "../linn-api/linn-api";

/**
 * @property {string} _id
 * @property {orderObject[]} arrived
 * @property {boolean} complete
 * @property {number} date
 * @property {string} id
 * @property {number} price
 * @property {orderObject[]} order
 * @property {string} supplier
 */
export interface shopOrder {
    _id?: string
    arrived: orderObject[] | []
    complete: boolean
    date: number
    id: string
    price: number
    order: orderObject[] | []
    supplier: string
}

/**
 * @property {{BRAND: string}} IDBEP
 * @property {number} MINSTOCK
 * @property {string} SKU
 * @property {string} STOCKTOTAL
 * @property {string} TITLE
 * @property {string} SUPPLIER
 * @property {string} _id
 * @property {string} [bookedIn]
 * @property {number} qty
 * @property {number} tradePack
 * @property {number} [arrived]
 * @property {number} PURCHASEPRICE
 * @property {boolean} [deadStock]
 * @property {boolean} [newProduct]
 * @property {boolean} [lowStock]
 * @property {boolean} submitted
 * @property {number} SOLDFLAG
 */
export interface orderObject {
    IDBEP: { BRAND: string }
    MINSTOCK: number
    SKU: string
    STOCKTOTAL: string
    TITLE: string
    SUPPLIER: string
    _id: string
    bookedIn?: string
    qty: number
    tradePack: number
    arrived?: number
    PURCHASEPRICE: number
    deadStock?: boolean
    newProduct?: boolean
    lowStock?: boolean
    submitted: boolean
    SOLDFLAG: number
}

export const getLowStock = async () => {
    return await mongoI.find<sbt.Item>("Items",
        {IDBFILTER: "domestic", MINSTOCK: {$gt: 0}, $expr: {$lt: ["$STOCKTOTAL", "$MINSTOCK"]}},
        {TITLE: 1, SKU: 1, STOCKTOTAL: 1, PURCHASEPRICE:1, MINSTOCK: 1, SUPPLIER: 1, "IDBEP.BRAND": 1})
}
export const shopStockOrder = async (order:shopOrder) => {
    if (order._id !== undefined) delete order._id
    return await mongoI.setData("Shop-Orders", {date: order.date}, order)
}

export const getCompleteOrders = async (start:object = {}, end:object = {}, supplier:object = {}) => {
    const result =  await mongoI.find<shopOrder>("Shop-Orders", {$and: [start, end, supplier, {complete: {$eq: true}}]}, {}, {SUPPLIER:1})
    return result ? result : []
}

export const getOpenOrders = async () => {
    const result = await mongoI.find<shopOrder>("New-Shop-Orders", {complete: false})
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
export const adjustStock =  async (arr:{SKU:string,QTY:string}[], id:string) => {
    let stockData = []
    for (let item of arr) {
        let details = {
            "SKU": item.SKU,
            "LocationId": "00000000-0000-0000-0000-000000000000",
            "Level": item.QTY
        }
        stockData.push(details)
    }
    return await linn.adjustStock(stockData, id)
}

export const getSuppliers = async () => {
    return await mongoI.findDistinct("Items", "SUPPLIER", {})
}

export const getBrandsForSupplier = async (supplier:string) => {
    return await mongoI.findDistinct("Items", "IDBEP.BRAND", {SUPPLIER:supplier})
}


/**
 * @property {string} _id
 * @property {string} SUPPLIER
 * @property {number} LOWSTOCKCOUNT
 */
export interface SupplierLowStock {
    _id:string,
    SUPPLIER:string,
    LOWSTOCKCOUNT:number
}
export const getSuppliersAndLowStock = async () => {
    const query = [
        {
            '$match': {
                'IDBFILTER': 'domestic',
                'LISTINGVARIATION' : false
            }
        }, {
            '$group': {
                '_id': '$SUPPLIER',
                'LOWSTOCKCOUNT': {
                    '$sum': {
                        '$cond': [
                            {
                                '$lt': [
                                    '$STOCKTOTAL', '$MINSTOCK'
                                ]
                            }, 1, 0
                        ]
                    }
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'SUPPLIER': '$_id',
                'LOWSTOCKCOUNT': 1
            }
        }, {
            '$sort':{
                'SUPPLIER':1
            }
        }
    ]
    const result = await mongoI.findAggregate<SupplierLowStock>("Items", query)
    return result ? result : []
}

/**
 * Supplier Item
 * @property {string} SKU
 * @property {string} TITLE
 * @property {{BRAND: string}} IDBEP
 * @property {number} MINSTOCK
 * @property {number} STOCKTOTAL
 * @property {number} PURCHASEPRICE
 */
export interface SupplierItem {
    SKU: string,
    TITLE: string,
    IDBEP:{BRAND: string},
    MINSTOCK: number,
    STOCKTOTAL: number,
    PURCHASEPRICE:number
}
export const getSupplierItems = async (supplier:string) => {
    let result = await mongoI.find<SupplierItem>("Items", {SUPPLIER: supplier, IDBFILTER: "domestic"}, {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, MINSTOCK: 1, STOCKTOTAL: 1, PURCHASEPRICE:1},{SKU:1})
    return result ? result : []
}