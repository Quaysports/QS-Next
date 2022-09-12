import mongoI = require('../mongo-interface/mongo-interface');
import linn = require("../linn-api/linn-api");

interface shopOrder {
    _id?: string
    arrived: orderItem[] | []
    complete: boolean
    date: number
    id: string
    price: number
    order: orderItem[] | []
    supplier: string
}

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

// Shop order tool
export const getLowStock = async () => {
    return await mongoI.find<sbt.Item>("Items",
        {IDBFILTER: "domestic", MINSTOCK: {$gt: 0}, $expr: {$lt: ["$STOCKTOTAL", "$MINSTOCK"]}},
        {TITLE: 1, SKU: 1, STOCKTOTAL: 1, PURCHASEPRICE:1, MINSTOCK: 1, SUPPLIER: 1, "IDBEP.BRAND": 1})
}
export const shopStockOrder = async (order:shopOrder) => {
    if (order._id !== undefined) delete order._id
    return await mongoI.setData("Shop-Orders", {date: order.date}, order)
}
export const getOpenOrders = async () => {
    return await mongoI.find<shopOrder>("Shop-Orders", {complete: false})
}
export const getCompleteOrders = async (start:object = {}, end:object = {}, supplier:object = {}) => {
    return await mongoI.find<shopOrder>("Shop-Orders", {$and: [start, end, supplier, {complete: {$eq: true}}]})
}
export const deleteOrder = async (order:shopOrder) => {
    return await mongoI.deleteOne("Shop-Orders", {date: order.date})
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
export const adjustStock = async (arr:{SKU:string,QTY:string}[], id:string) => {
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
    return await linn.getLinnQuery<{SupplierName:string}>("Select SupplierName FROM Supplier WHERE bLogicalDelete = 'false'")
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
    return await mongoI.findAggregate<{ _id:string,SUPPLIER:string,LOWSTOCKCOUNT:number }>("Items", query)
}
export const getSupplierItems = async (supplier:string) => {
    return await mongoI.find<sbt.Item>("Items", {SUPPLIER: supplier, IDBFILTER: "domestic"}, {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, MINSTOCK: 1, STOCKTOTAL: 1, PURCHASEPRICE:1},{SKU:1})
}