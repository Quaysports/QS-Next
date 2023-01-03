import {NextApiRequest, NextApiResponse} from "next";
import {getStockValueCSVData} from "../../../server-modules/items/items";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    let data = await getStockValueCSVData(req.body)
    console.log(data)
    res.status(200).send(
        data
    )
}