import {findAggregate} from "../mongo-interface/mongo-interface";
import {sortData} from "../core/core";

export interface ShopTotal {
    year?: number
    grandTotal: number
    profit: number
    profitWithLoss: number
}

export interface ShopYearTotals extends ShopTotal {
}

export interface ShopMonthTotal extends ShopTotal {
    month: number
}

export interface OnlineTotal {
    year?: number
    source?: string
    grandTotal: number
    profit: number
    orders: number
}

export interface OnlineMonthTotal extends OnlineTotal {
    month: number
}

export type OnlineYearTotals = OnlineTotal[]

type Location = "shop" | "online"

export async function getReportYears(location: Location) {
    let query = location === "shop"
        ? [
            {
                '$group': {
                    '_id': null,
                    'first': {
                        '$first': '$$ROOT'
                    },
                    'last': {
                        '$last': '$$ROOT'
                    }
                }
            }, {
                '$project': {
                    'firstYear': '$first.transaction.date',
                    'lastYear': '$last.transaction.date'
                }
            }
        ]
        : [
            {
                '$group': {
                    '_id': null,
                    'first': {
                        '$first': '$$ROOT'
                    },
                    'last': {
                        '$last': '$$ROOT'
                    }
                }
            }, {
                '$project': {
                    'firstYear': '$first.date',
                    'lastYear': '$last.date'
                }
            }
        ]
    const collection = location === "shop" ? "Till-Transactions" : "Online-Orders"
    let result = await findAggregate<{ firstYear: string, lastYear: string }>(collection, query)
    if (!result) return null
    return result[0]
}

export async function getShopYearData(year: number, to: number | undefined = undefined) {

    let from = new Date(year, 0, 1, 2, 0).getTime()
    if (!to) to = new Date(year, 11, 31, 22, 0).getTime()

    let query = [
        {
            '$match': {
                '$and': [
                    {'paid': true},
                    {'transaction.date': {'$gt': from.toString()}},
                    {'transaction.date': {'$lt': to.toString()}}
                ]
            }
        }, {
            '$group': {
                '_id': null,
                'grandTotal': {'$sum': '$grandTotal'},
                'profit': {'$sum': '$profit'},
                'profitWithLoss': {'$sum': '$profitWithLoss'}
            }
        }
    ]
    let result = await findAggregate<ShopYearTotals>("Till-Transactions", query)
    if (!result || result.length === 0) return null
    result[0].year = year
    return result[0] as ShopYearTotals
}

export async function getOnlineYearData(year: number, to: number | undefined = undefined) {
    let from = new Date(year, 0, 1, 2, 0).getTime()
    if (!to) to = new Date(year, 11, 31, 22, 0).getTime()

    let query = [
        {
            '$match': {
                '$and': [
                    {'date': {'$gt': from.toString()}},
                    {'date': {'$lt': to.toString()}},
                    {'source': {'$ne': 'direct'}}
                ]
            }
        },
        {
            $group: {
                _id: "$source",
                grandTotal: {$sum: "$price"},
                profit: {$sum: "$profit"},
                orders: {$sum: 1}
            },
        },
        {
            $project: {
                _id: 0,
                source: "$_id",
                grandTotal: 1,
                profit: 1,
                orders:1
            }
        }
    ]
    let result = await findAggregate<OnlineTotal>("Online-Orders", query)
    let data:OnlineYearTotals = []
    if (!result || result.length === 0) return null
    let grandTotal = 0
    let profit = 0
    let orders = 0
    for (let i = 0; i < result.length; i++) {
        grandTotal += result[i].grandTotal
        profit += result[i].profit
        orders += result[i].orders
        data.push(result[i])
    }
    data.push({year: year, grandTotal, profit, orders})
    sortData<OnlineTotal>("source", data)

    return data
}

export async function getShopMonthDataForYear(year: number, to: number | undefined = undefined) {
    const data = []
    for (let i = 0; i < 12; i++) {
        //checks to make sure month [i] matches the partial month [to] parameter
        let monthToDate
        if (to) monthToDate = i === new Date(to).getMonth() ? to : undefined
        let monthData = await getShopMonthData(year, i, monthToDate)
        if (!monthData) continue
        data.push(monthData)
    }
    return data
}

export async function getOnlineMonthDataForYear(year: number, to: number | undefined = undefined) {
    const data = []
    for (let i = 0; i < 12; i++) {
        //checks to make sure month [i] matches the partial month [to] parameter
        let monthToDate
        if (to) monthToDate = i === new Date(to).getMonth() ? to : undefined
        let monthData = await getOnlineMonthData(year, i, monthToDate)
        if (!monthData) continue
        sortData("source", monthData)
        data.push(monthData)
    }
    return data
}

export async function getShopMonthData(year: number, month: number, to: number | undefined = undefined) {

    let currentMonth = new Date().getMonth()
    let endOfMonth = new Date(year, month + 1, 0).getDate()

    let from = new Date(year, month, 1, 2, 0).getTime()
    if (!to || currentMonth !== new Date(to).getMonth())
        to = new Date(year, month, endOfMonth, 22, 0).getTime()

    let query = [
            {
                '$match': {
                    '$and': [
                        {'paid': true},
                        {'transaction.date': {'$gt': from.toString()}},
                        {'transaction.date': {'$lt': to.toString()}}
                    ]
                }
            }, {
                '$group': {
                    '_id': null,
                    'grandTotal': {'$sum': '$grandTotal'},
                    'profit': {'$sum': '$profit'},
                    'profitWithLoss': {'$sum': '$profitWithLoss'}
                }
            }
        ]
    let result = await findAggregate<ShopMonthTotal>("Till-Transactions", query)

    if (!result || result.length === 0) return null

    result[0].year = year
    result[0].month = month
    return result[0]
}

export async function getOnlineMonthData(year: number, month: number, to: number | undefined = undefined) {
    let currentMonth = new Date().getMonth()
    let endOfMonth = new Date(year, month + 1, 0).getDate()

    let from = new Date(year, month, 1, 2, 0).getTime()
    if (!to || currentMonth !== new Date(to).getMonth())
        to = new Date(year, month, endOfMonth, 22, 0).getTime()

    let query = [
            {
                $match: {
                    $and: [
                        {date: {$gt: from.toString()}},
                        {date: {$lt: to.toString(),}},
                        {source: {'$ne': 'direct'}}
                    ],
                },
            },
            {
                $group: {
                    _id: "$source",
                    grandTotal: {$sum: "$price"},
                    profit: {$sum: "$profit"},
                    orders: {$sum: 1}
                },
            },
            {
                $project: {
                    _id: 0,
                    source: "$_id",
                    grandTotal: 1,
                    profit: 1,
                    orders:1
                }
            }
        ]

    let result = await findAggregate<OnlineMonthTotal>("Online-Orders", query)

    if (!result || result.length === 0) return null

    const data = []
    let grandTotal = 0
    let profit = 0
    let orders = 0
    for (let i = 0; i < result.length; i++) {
        grandTotal += result[i].grandTotal
        profit += result[i].profit
        orders += result[i].orders
        data.push(result[i])
    }
    data.push({year: year, month:month, grandTotal, profit, orders})
    return data
}

interface ShopDayQueryResult {
    id: string
    date: string
    flatDiscount: number
    percentageDiscount: number
    percentageDiscountAmount: number
    giftCardDiscount: number
    grandTotal: number
    profit: number
    profitWithLoss: number
    type: string
    amount: number
    cash: number
    change: number
    till: string
    discountReason: string
    processedBy: string
}

export interface ShopDayTotal {
    date: string
    orders: ShopDayQueryResult[]
    totalDiscount: number
    totalGiftCardDiscount: number
    totalProfit: number
    totalProfitWithLoss: number
    totalGrandTotal: number
    totalCash: number
    totalChange: number
    totalCard: number
    till: { id: string, amount: number }[]
    discounts: {
        id: string,
        name: string,
        grandTotal: number,
        flatDiscount: number,
        percentageDiscount: number,
        percentageDiscountAmount: number,
        discountReason: string
    }[]
}

export async function getShopMonthDayByDayDataForYear(year: number, month: number) {
    if (isNaN(year) || isNaN(month)) return null
    const startOfMonth = new Date(year, month, 1, 2, 0).getTime().toString()
    const endOfMonth = new Date(year, month + 1, 0, 22, 0).getTime().toString()

    let query = [
        {
            '$match': {
                '$and': [
                    {
                        'transaction.date': {
                            '$gt': startOfMonth
                        }
                    }, {
                        'transaction.date': {
                            '$lt': endOfMonth
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'id': 1,
                'date': {
                    '$dateToString': {
                        'date': {
                            '$convert': {
                                'input': {
                                    '$convert': {
                                        'input': '$transaction.date',
                                        'to': 'long'
                                    }
                                },
                                'to': 'date'
                            }
                        },
                        'format': '%Y-%m-%d'
                    }
                },
                'flatDiscount': 1,
                'percentageDiscount': 1,
                'percentageDiscountAmount': 1,
                'giftCardDiscount': 1,
                'grandTotal': 1,
                'profit': 1,
                'profitWithLoss': 1,
                'discountReason':1,
                'type': '$transaction.type',
                'amount': '$transaction.amount',
                'cash': '$transaction.cash',
                'change': '$transaction.change',
                'till': 1,
                'processedBy': 1
            }
        }
    ]

    let result = await findAggregate<ShopDayQueryResult>("Till-Transactions", query)
    if (!result) return null

    let data: ShopDayTotal[] = []
    for (let order of result) {
        let day = data.find(d => d.date === order.date)
        if (!day) {
            day = {
                date: order.date,
                orders: [],
                totalDiscount: 0,
                totalGiftCardDiscount: 0,
                totalProfit: 0,
                totalProfitWithLoss: 0,
                totalGrandTotal: 0,
                totalCash: 0,
                totalChange: 0,
                totalCard: 0,
                till: [],
                discounts: []
            }
            data.push(day)
        }
        day.orders.push(order)
        day.totalDiscount += order.flatDiscount + order.percentageDiscountAmount
        day.totalGiftCardDiscount += order.giftCardDiscount
        day.totalProfit += order.profit
        day.totalProfitWithLoss += order.profitWithLoss
        day.totalGrandTotal += order.grandTotal
        day.totalCash += order.type === "CASH" ? order.amount : 0
        day.totalChange += order.change
        day.totalCard += order.type !== "CASH" && order.type !== "FULLDISCOUNT" ? order.amount : 0

        if (order.type === "CASH") {
            let till = day.till.find(t => t.id === order.till)
            if (!till) {
                till = {id: order.till, amount: 0}
                day.till.push(till)
            }
            till.amount += order.amount
        }

        if (order.flatDiscount > 0 || order.percentageDiscountAmount > 0) {
            let discount = day.discounts.find(d => d.id === order.id)
            if (!discount) {
                discount = {
                    id: order.id,
                    name: order.processedBy,
                    grandTotal: order.grandTotal,
                    flatDiscount: order.flatDiscount,
                    percentageDiscount: order.percentageDiscount,
                    percentageDiscountAmount: order.percentageDiscountAmount,
                    discountReason: order.discountReason
                }
                day.discounts.push(discount)
            }
        }
    }
    return data
}

interface OnlineDayQueryResult {
    date: string
    source: string
    grandTotal: number
    profit: number
}

export interface OnlineDayTotal {
    date: string
    amazon: OnlineDayQueryResult | null
    ebay: OnlineDayQueryResult | null
    magento: OnlineDayQueryResult | null
}

export async function getOnlineMonthDayByDayDataForYear(year: number, month: number) {
    if (isNaN(year) || isNaN(month)) return null
    const startOfMonth = new Date(year, month, 1, 2, 0).getTime().toString()
    const endOfMonth = new Date(year, month + 1, 0, 22, 0).getTime().toString()

    const query = [
        {
            '$match': {
                '$and': [
                    {
                        'date': {
                            '$gt': startOfMonth
                        }
                    }, {
                        'date': {
                            '$lt': endOfMonth
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'date': {
                    '$dateToString': {
                        'date': {
                            '$convert': {
                                'input': {
                                    '$convert': {
                                        'input': '$date',
                                        'to': 'long'
                                    }
                                },
                                'to': 'date'
                            }
                        },
                        'format': '%Y-%m-%d'
                    }
                },
                'grandTotal': '$price',
                'profit': 1,
                'source': 1
            }
        }, {
            '$group': {
                '_id': {
                    'source': '$source',
                    'date': '$date'
                },
                'grandTotal': {
                    '$sum': '$grandTotal'
                },
                'profit': {
                    '$sum': '$profit'
                }
            }
        }, {
            '$project': {
                'source': '$_id.source',
                'date': '$_id.date',
                'grandTotal': '$grandTotal',
                'profit': '$profit'
            }
        }
    ]
    let result = await findAggregate<OnlineDayQueryResult>("Online-Orders", query)
    if (!result) return null

    let data: OnlineDayTotal[] = []
    for (let order of result) {
        let day = data.find(d => d.date === order.date)
        if (!day) {
            day = {
                date: order.date,
                amazon: null,
                ebay: null,
                magento: null
            }
            data.push(day)
        }
        if (order.source === "amazon") {
            day.amazon = order
        } else if (order.source === "ebay") {
            day.ebay = order
        } else if (order.source === "magento") {
            day.magento = order
        }
    }
    sortData("date", data)
    return data
}
