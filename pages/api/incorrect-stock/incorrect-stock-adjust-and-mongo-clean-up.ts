import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import * as linn from "../../../server-modules/linn-api/linn-api"
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(
        await incorrectStockAdjustAndMongoCleanUp(req.body.updateId, req.body.data )
    )
}

async function incorrectStockAdjustAndMongoCleanUp(id: string, arr: { SKU:string,QTY:string }[]){
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