import {getItems} from "../../../server-modules/items/items";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).send(await getItems({"IDBEP.BRAND":req.body, IDBFILTER:"domestic", ISCOMPOSITE:false}, {SKU:1, TITLE:1,EAN:1, STOCKTOTAL:1, stockTake:1}))
}