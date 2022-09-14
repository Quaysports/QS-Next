import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import * as linn from "../../../server-modules/linn-api/linn-api"

export default async function handler(req, res) {
    res.status(200).json(
        await incorrectStockAdjustAndMongoCleanUp(req.body.DATA, req.body.QUERY)
    )
}

async function incorrectStockAdjustAndMongoCleanUp(arr: { SKU:string,QTY:string }[], id: string){
    let stockData = []
    let mongoCleanUp = []
    for (let item of arr) {
        let details = {
            "SKU": item.SKU,
            "LocationId": "00000000-0000-0000-0000-000000000000",
            "Level": item.QTY
        }
        stockData.push(details)
        mongoCleanUp.push(item.SKU)
    }
    await linn.adjustStock(stockData, id)
    return await mongoI.deleteMany("Shop-Stock-Report", mongoCleanUp)
}