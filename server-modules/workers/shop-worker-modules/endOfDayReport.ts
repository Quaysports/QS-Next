import mongoI = require("../../mongo-interface/mongo-interface");

interface shopTakings {
    [key: string]: takings
}

export interface takings {
    _id?:string
    date: string
    items: items
    transactions: transaction
    discounts: discounts
}

interface items {
    [key: string]: {
        amount?: number
        qty?: number
        price?: number
        total?: number
        purchasePrice?: number
        iZettle?: number
        vat?: number
        profit?: number
        custom?: boolean
    };
    totals: total;
}

interface total {
    amount: any;
    purchasePrice: number
    iZettle: number
    vat: number
}

interface transaction {
    cash: number
    cashTaken: number
    change: number
    card: number
    giftCard: number
    total: number
    vat: number
    iZettle: number
    purchasePrice: number
    profit: number
    cardIds: string[]
    cashIds: string[]
    till: {[key: string]: number}
}

interface discounts {
    [key: string]: discount
}

interface discount {
    total?: string;
    grandTotal?: string;
    processedBy?: string;
    flatDiscount?: string;
    perDiscount?: string;
    flat?: number;
    per?: number;
}


export const endOfDayReport = async () => {

    let shopTakings: shopTakings = {}
    const date = new Date()
    //set time to 3am to avoid clock change conflicts
    date.setHours(3, 0, 0, 0)
    date.setDate(date.getDate() - 5)

    const query = {"transaction.date": {"$gt": date.getTime().toString()}}
    const shopOrders = await mongoI.find<sbt.shopOrder>("Shop", query)
    if (!shopOrders) return

    const itemSkus = await convertArchivedSKUs(shopOrders)

    const itemPurchasePrices = await mongoI.find<{ SKU: string, PURCHASEPRICE: number }>(
        "Items",
        {SKU: {$in: itemSkus}},
        {SKU: 1, PURCHASEPRICE: 1})
    if (!itemPurchasePrices) return

    const purchasePrices = new Map(itemPurchasePrices.map(item => [item.SKU, item.PURCHASEPRICE]))

    function calcProfit(total: number, purchaseprice: number) {
        return {
            profit: total - ((total * 0.0175) + (total - (total / 1.2)) + purchaseprice),
            iZettle: total * 0.0175,
            vat: total - (total / 1.2)
        }
    }

    const getProfit = async (item: sbt.shopOrderItem, items: items, transactions: transaction, discounts: discount) => {

        if (isNaN(item.TOTAL)) {
            if (isNaN(item.PRICE)) item.PRICE = 0
            if (isNaN(item.QTY)) item.QTY = 0
            item.TOTAL = item.PRICE * item.QTY
        }

        if (purchasePrices.has(item.SKU)) {
            item.PURCHASEPRICE = purchasePrices.get(item.SKU)! > 0 ? purchasePrices.get(item.SKU)! : item.TOTAL / item.QTY * 0.50
        } else {
            item.PURCHASEPRICE = item.TOTAL / item.QTY * 0.60
        }

        items[item.SKU] ??= {
            qty: 0,
            price: 0,
            total: 0,
            purchasePrice: 0,
            iZettle: 0,
            vat: 0,
            profit: 0,
            custom: false
        }

        if (item.EAN?.indexOf("EAN") !== -1 && !item.LINNID) items[item.SKU].custom = true;

        if (item.SKU.indexOf("QSGIFT") !== -1) {
            transactions.giftCard += item.TOTAL
            transactions.total -= item.TOTAL
            items[item.SKU].qty! += item.QTY
            items[item.SKU].price! = item.PRICE
            items[item.SKU].total! += item.TOTAL
            items[item.SKU]!.purchasePrice! += item.PURCHASEPRICE
        } else {
            if (discounts.per) item.TOTAL -= (item.TOTAL / 100) * discounts.per
            if (discounts.flat) item.TOTAL = item.TOTAL - discounts.flat

            items[item.SKU].qty! += item.QTY
            items[item.SKU].price! = item.PRICE
            items[item.SKU].total! += item.TOTAL
            items[item.SKU].iZettle! += item.TOTAL * 0.0175
            items[item.SKU].vat! += item.TOTAL - (item.TOTAL / 1.2)
            items[item.SKU].purchasePrice! += item.PURCHASEPRICE * item.QTY

            let calc = calcProfit(item.TOTAL, item.PURCHASEPRICE * item.QTY)

            items[item.SKU].profit! += calc.profit
            items.totals.amount! += item.TOTAL
            items.totals.purchasePrice! += item.PURCHASEPRICE * item.QTY
            items.totals.iZettle! += item.TOTAL * 0.0175
            items.totals.vat! += item.TOTAL - (item.TOTAL / 1.2)
            transactions.purchasePrice += item.PURCHASEPRICE * item.QTY
        }
        return
    }

    const calculate = async (order: sbt.shopOrder) => {
        let date = new Date(Number(order.transaction.date))
        date.setHours(3, 0, 0, 0)
        let id = date.getTime().toString()
        shopTakings[id] ??= {
            date: id,
            items: {
                totals: {
                    amount: 0,
                    purchasePrice: 0,
                    iZettle: 0,
                    vat: 0
                }
            },
            transactions: {
                cash: 0,
                cashTaken: 0,
                change: 0,
                card: 0,
                giftCard: 0,
                total: 0,
                vat: 0,
                iZettle: 0,
                purchasePrice: 0,
                profit: 0,
                cardIds: [],
                cashIds: [],
                till: {}
            },
            discounts: {}
        }

        let discounts: discount = {per: undefined, flat: undefined}
        if (parseFloat(order["perDiscount"]) > 0 || parseFloat(order["flatDiscount"]) > 0) {
            shopTakings[id].discounts[order.id] ??= {}

            if (parseFloat(order["perDiscount"]) > 0) {
                discounts.per = parseFloat(order["perDiscount"])
                shopTakings[id].discounts[order.id].perDiscount = order.perDiscount
            }
            if (parseFloat(order["flatDiscount"]) > 0) {
                discounts.flat = parseFloat(order["flatDiscount"]) / order.order.length
                shopTakings[id].discounts[order.id].flatDiscount = order.flatDiscount
            }

            shopTakings[id].discounts[order.id].processedBy = order.processedBy
            shopTakings[id].discounts[order.id].grandTotal = order.grandTotal
            if (parseFloat(order["giftCardDiscount"]) > 0) {
                shopTakings[id].discounts[order.id].grandTotal! += parseFloat(order["giftCardDiscount"])
            }

            shopTakings[id].discounts[order.id].total = order.total
        }

        for (const item of order.order) {
            if (order.transaction.amount !== "0.0" && order.transaction.type !== "Failed" && order.transaction.type !== "Cancelled") {
                await getProfit(item, shopTakings[id].items, shopTakings[id].transactions, discounts)
            }
        }

        if (order.transaction.amount !== "0.0" && order.transaction.type !== "Failed" && order.transaction.type !== "Cancelled") {
            if (order.transaction.type !== "CASH") {
                shopTakings[id].transactions.card += parseFloat(order.transaction.amount!)
                shopTakings[id].transactions.total += parseFloat(order.transaction.amount!)
                if (order.transaction.type === "SPLIT") {
                    shopTakings[id].transactions.cash += parseFloat(String(order.transaction.cash!))
                    shopTakings[id].transactions.total += parseFloat(String(order.transaction.cash!))
                    if (order.till) {
                        if (!shopTakings[id].transactions.till[order.till]) shopTakings[id].transactions.till[order.till] = 0
                        shopTakings[id].transactions.till[order.till] += parseFloat(String(order.transaction.cash!))
                    }
                }
                shopTakings[id].transactions.cardIds.push(order.id)
            } else {
                shopTakings[id].transactions.cash += parseFloat(order.transaction.amount!)
                shopTakings[id].transactions.total += parseFloat(order.transaction.amount!)
                shopTakings[id].transactions.cashTaken += parseFloat(String(order.transaction.cash!))
                if (order.transaction.change) shopTakings[id].transactions.change += parseFloat(String(order.transaction.change!))
                shopTakings[id].transactions.cashIds.push(order.id)
                if (order.till) {
                    if (!shopTakings[id].transactions.till[order.till]) shopTakings[id].transactions.till[order.till] = 0
                    shopTakings[id].transactions.till[order.till] += parseFloat(order.transaction.amount!)
                    console.log(shopTakings[id].transactions.till[order.till])
                }
            }
            if (order.transaction.giftCard && order.transaction.giftCard > 0) {
                shopTakings[id].transactions.total += order.transaction.giftCard!
            }
        }

        return
    }

    for (const order of shopOrders) await calculate(order)

    for (let day in shopTakings) {
        let profit = calcProfit(shopTakings[day].transactions.total, shopTakings[day].transactions.purchasePrice)
        shopTakings[day].transactions.iZettle = profit.iZettle
        shopTakings[day].transactions.vat = profit.vat
        shopTakings[day].transactions.profit = profit.profit
        await mongoI.setData("Shop-Reports", {date: day}, shopTakings[day])
    }
    return {}
}

const convertArchivedSKUs = async (shopOrders: sbt.shopOrder[]) => {
    let skus: string[] = []
    const archive = await mongoI.findOne<{ [key: string]: string }>("Archived-SKU")
    for (let order of shopOrders) {
        for (let item of order.order) {
            if (archive![item.SKU]) item.SKU = archive![item.SKU]
            if (skus.indexOf(item.SKU) === -1) skus.push(item.SKU)
        }
    }
    return skus
}