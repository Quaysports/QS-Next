import {findAggregate} from "../mongo-interface/mongo-interface";

export interface Totals {
    year?:number
    grandTotal: number
    profit: number
    profitWithLoss: number
}

export interface YearTotals extends Totals {}

export interface MonthTotals extends Totals {
    month: number
}

export async function getShopReportYears() {
    let query = [
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
    let result = await findAggregate("Till-Transactions", query)
    if(!result) return null
    return result[0]
}

export async function getYearData(year:number, to:number | undefined = undefined){

    let from = new Date(year, 0, 1, 2, 0).getTime()
    if(!to) to = new Date(year, 11, 31, 22, 0).getTime()

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
    let result = await findAggregate<YearTotals>("Till-Transactions", query)
    if(!result || result.length === 0) return null
    result[0].year = year
    return result[0]
}

export async function getMonthDataForYear(year:number, to:number | undefined = undefined){
    const data:MonthTotals[] = []
    for(let i = 0; i < 12; i++){

        //checks to make sure month [i] matches the partial month [to] parameter
        let monthToDate
        if(to) monthToDate = i === new Date(to).getMonth() ? to : undefined

        let monthData = await getMonthData(year, i, monthToDate)
        if(!monthData) continue
        data.push(monthData)
    }
    return data
}

export async function getMonthData(year:number, month:number, to:number | undefined = undefined){

        let currentMonth = new Date().getMonth()
        let endOfMonth = new Date(year, month + 1, 0).getDate()

        let from = new Date(year, month, 1, 2, 0).getTime()
        if(!to || currentMonth !== new Date(to).getMonth())
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
        let result = await findAggregate<MonthTotals>("Till-Transactions", query)

        if(!result || result.length === 0) return null

        // @ts-ignore
        result[0].query = query
        result[0].year = year
        result[0].month = month
        return result[0]
}

interface DayQueryResult {
    id:string
    date:string
    flatDiscount:number
    percentageDiscount:number
    percentageDiscountAmount:number
    giftCardDiscount:number
    grandTotal:number
    profit:number
    profitWithLoss:number
    type:string
    amount:number
    cash:number
    change:number
    till:string
    processedBy:string
}

export interface DayTotal {
    date: string
    orders: DayQueryResult[]
    totalDiscount: number
    totalGiftCardDiscount: number
    totalProfit: number
    totalProfitWithLoss: number
    totalGrandTotal: number
    totalCash: number
    totalChange: number
    totalCard: number
    till:{id:string, amount:number}[]
    discounts:{
        id:string,
        name:string,
        grandTotal:number,
        flatDiscount:number,
        percentageDiscount: number,
        percentageDiscountAmount:number }[]
}

export async function getMonthDayByDayDataForYear(year:number, month:number){
    if(isNaN(year) || isNaN(month)) return null
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
                'type': '$transaction.type',
                'amount': '$transaction.amount',
                'cash': '$transaction.cash',
                'change': '$transaction.change',
                'till':1,
                'processedBy':1
            }
        }
    ]

    let result = await findAggregate<DayQueryResult>("Till-Transactions", query)
    if(!result) return null

    let data:DayTotal[] = []
    for(let order of result){
        let day = data.find(d => d.date === order.date)
        if(!day){
            day = {
                date: order.date,
                orders: [],
                totalDiscount: 0,
                totalGiftCardDiscount:0,
                totalProfit: 0,
                totalProfitWithLoss: 0,
                totalGrandTotal: 0,
                totalCash: 0,
                totalChange: 0,
                totalCard: 0,
                till:[],
                discounts:[]
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

        if(order.type === "CASH"){
            let till = day.till.find(t => t.id === order.till)
            if(!till){
                till = {id:order.till, amount:0}
                day.till.push(till)
            }
            till.amount += order.amount
        }

        if(order.flatDiscount > 0 || order.percentageDiscountAmount > 0){
            let discount = day.discounts.find(d => d.id === order.id)
            if(!discount){
                discount = {
                    id:order.id,
                    name:order.processedBy,
                    grandTotal:order.grandTotal,
                    flatDiscount:order.flatDiscount,
                    percentageDiscount:order.percentageDiscount,
                    percentageDiscountAmount:order.percentageDiscountAmount
                }
                day.discounts.push(discount)
            }
        }
    }
    return data
}