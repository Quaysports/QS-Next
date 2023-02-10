import {findAggregate} from "../mongo-interface/mongo-interface";

export async function getReportYears(location: string) {
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
                'first': '$first.transaction.date',
                'last': '$last.transaction.date'
            }
        }
    ]
    let reportYears = await findAggregate("Till-Transactions", query)
}