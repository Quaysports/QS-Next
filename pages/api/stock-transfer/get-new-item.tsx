import {NextApiRequest, NextApiResponse} from "next";
import {getNewItem} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    console.log(req.body)
    let item = await getNewItem(req.body)
    if(!item)res.status(400).send({})
    if(item)res.status(200).send(item)
}