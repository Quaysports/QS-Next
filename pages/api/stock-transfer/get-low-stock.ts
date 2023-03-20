import {NextApiRequest, NextApiResponse} from "next";
import {getInternationalLowStockItems} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    let items = await getInternationalLowStockItems()
    res.status(items.code).send({message:items.message, items:items.items})
}