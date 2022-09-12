import mongoI = require('../mongo-interface/mongo-interface')

export const missingBrands = async () => {
    let query = {IDBFILTER: "domestic", "IDBEP.BRAND": {$exists: false}}
    let proj = {SKU: 1, TITLE: 1, SUPPLIER: 1}
    let sort = {SUPPLIER: 1, TITLE: 1}
    return await mongoI.find<sbt.Item>("Items", query, proj, sort)
}
