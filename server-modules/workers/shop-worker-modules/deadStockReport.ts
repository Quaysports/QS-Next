import mongoI = require("../../mongo-interface/mongo-interface");

export const deadStockReport = async () => {
    let pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - 6)
    let items = await mongoI.findAggregate<string[]>("Shop-Reports", [
        {
            '$match': {
                'date': {
                    '$gt': pastDate.getTime()
                }
            }
        }, {
            '$project': {
                'items': {
                    '$objectToArray': '$items'
                }
            }
        }, {
            '$unwind': {
                'path': '$items',
                'includeArrayIndex': 'string',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$group': {
                '_id': '',
                'items': {
                    '$addToSet': '$items.k'
                }
            }
        }
    ])
    return await mongoI.find<{SUPPLIER: string, SKU: string, TITLE: string}>("Items", {
        SKU: {$nin: items},
        STOCKTOTAL: {$gt: 0},
        IDBFILTER: "domestic"
    }, {SUPPLIER: 1, SKU: 1, TITLE: 1})
}