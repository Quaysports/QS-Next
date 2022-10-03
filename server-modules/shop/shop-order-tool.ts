import * as mongoI from '../mongo-interface/mongo-interface';
import * as linn from "../linn-api/linn-api";

/**
 * @property {string} _id
 * @property {orderItem[]} arrived
 * @property {boolean} complete
 * @property {number} date
 * @property {string} id
 * @property {number} price
 * @property {orderItem[]} order
 * @property {string} supplier
 */
export interface shopOrder {
    _id?: string
    arrived: orderItem[] | []
    complete: boolean
    date: number
    id: string
    price: number
    order: orderItem[] | []
    supplier: string
}
/**
 * @property {{BRAND:string}} IDBEP
 * @property {number} MINSTOCK
 * @property {string} SKU
 * @property {string} STOCKTOTAL
 * @property {string} TITLE
 * @property {string} _id
 * @property {string} bookedIn
 * @property {number} qty
 * @property {number} tradePack
 * @property {number} arrived
 * @property {number} purchasePrice
 * @property {boolean} deadStock
 */
interface orderItem {
    IDBEP: { BRAND: string }
    MINSTOCK: number
    SKU: string
    STOCKTOTAL: string
    TITLE: string
    _id: string
    bookedIn: string
    qty: number
    tradePack: number
    arrived: number
    purchasePrice: number
    deadStock: boolean
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
    return await mongoI.find<shopOrder>("Shop-Orders", {$and: [start, end, supplier, {complete: {$eq: true}}]})
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

export const getBrandsForSupplier = async (supplier) => {
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
                'IDBFILTER': 'domestic'
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
        }
    ]
    return await mongoI.findAggregate<SupplierLowStock>("Items", query)
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
    return await mongoI.find<SupplierItem>("Items", {SUPPLIER: supplier, IDBFILTER: "domestic"}, {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, MINSTOCK: 1, STOCKTOTAL: 1, PURCHASEPRICE:1},{SKU:1})
}