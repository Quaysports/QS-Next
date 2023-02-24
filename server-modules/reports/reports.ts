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
        let monthData = await getMonthData(year, i, to)
        if(!monthData) continue
        data.push(monthData)
    }
    return data
}

export async function getMonthData(year:number, month:number, to:number | undefined = undefined){

        let endOfMonth = new Date(year, month + 1, 0).getDate()

        let from = new Date(year, month, 1, 2, 0).getTime()
        if(!to) to = new Date(year, month, endOfMonth, 22, 0).getTime()

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
        result[0].year = year
        result[0].month = month
        return result[0]
}