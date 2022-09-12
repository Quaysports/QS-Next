import mongoI = require("../../mongo-interface/mongo-interface");

export interface OnlineSalesReport {
    date: string;
    orders: Order[];
    transactions: {
        amazon: number;
        ebay: number;
        quaysports: number;
        profit: number };
}

interface Order {
    refunds?: any;
    profit?: number;
    id: string,
    source: string,
    date: string,
    prices: Prices[],
    price: string
}

interface Prices {
    profit?: number;
    sku:string,
    qty:number
    price:number
}

interface ItemData {
    SKU: string,
    MD: {
        EBAYUKPAVC: number,
        AMAZPAVC: number,
        QSPAVC: number,
        TOTALPOSTAGEUK: number,
        PACKAGING: number,
        POSTALPRICEUK: number,
    }
}

export const onlineSalesReport = async () => {

    const date = new Date()
    date.setHours(3, 0, 0, 0)
    date.setDate(date.getDate() - 5)
    const query = {"date": {"$gt": date.toISOString()}}

    const orders = await mongoI.find<Order>("Orders", query, {
        id: 1,
        source: 1,
        date: 1,
        prices: 1,
        price: 1
    })
    if(!orders) return

    let skuList = []
    let merge:{[key: string]: OnlineSalesReport} = {}
    for (let order of orders) {
        for (let item of order.prices) {
            if (skuList.indexOf(item.sku) === -1) skuList.push(item.sku)
        }
    }

    const itemsResult = await mongoI.find<ItemData>("Items", {SKU: {$in: skuList}}, {
        SKU: 1,
        "MD.EBAYUKPAVC": 1,
        "MD.AMAZPAVC": 1,
        "MD.QSPAVC": 1,
        "MD.TOTALPOSTAGEUK": 1,
        "MD.PACKAGING": 1,
        "MD.POSTALPRICEUK": 1
    })

    if(!itemsResult) return

    const marginData = new Map(itemsResult.map(item => [item.SKU, item]))

    for (let order of orders) {

        order.profit = 0

        for (let item of order.prices) {
            if (marginData.has(item.sku)) {
                if (order.source === "AMAZON") item.profit = marginData.get(item.sku)?.MD.AMAZPAVC
                if (order.source === "EBAY") item.profit = marginData.get(item.sku)?.MD.EBAYUKPAVC
                if (order.source === "MAGENTO" || order.source === "DIRECT") item.profit = marginData.get(item.sku)?.MD.QSPAVC

                if (order.prices.length > 1 || item.qty > 1) {
                    refundExcessPostageAndPackaging(order, item, marginData)
                }
            } else {
                console.log("No margin data!")
                item.profit = 0
            }
            order.profit += item.qty * item.profit!
        }

        if (order.refunds) {
            let maxRefund = 0
            let totalRefund = 0
            for (let refund of order.refunds) {
                if (maxRefund < refund) maxRefund = refund
                totalRefund += refund
            }
            order.profit += totalRefund
            order.profit -= maxRefund
        }

        let date = new Date(order.date)
        date.setHours(3, 0, 0, 0)
        let id = date.getTime().toString()
        merge[id] ??= {
            date: id,
            orders: [],
            transactions: {
                ebay: 0,
                amazon: 0,
                quaysports: 0,
                profit: 0
            }
        }
        merge[id].orders.push(order)
        merge[id].transactions.profit += order.profit
        if (order.source === "AMAZON") merge[id].transactions.amazon += parseFloat(order.price)
        if (order.source === "EBAY") merge[id].transactions.ebay += parseFloat(order.price)
        if (order.source === "MAGENTO") merge[id].transactions.quaysports += parseFloat(order.price)
    }

    for (let i in merge) await mongoI.setData("Online-Reports", {date: merge[i].date}, merge[i]);
    return merge
}

const refundExcessPostageAndPackaging = (order:Order, item:Prices, marginData: Map<string, ItemData>) => {
    order.refunds ??= []
    let refund = (marginData.get(item.sku)!.MD.POSTALPRICEUK ??= 0) + (marginData.get(item.sku)!.MD.PACKAGING ??= 0)
    if (item.qty === 1) {
        order.refunds.push(refund);
    } else {
        for (let i = 0; i < item.qty; i++) order.refunds.push(refund);
    }
}