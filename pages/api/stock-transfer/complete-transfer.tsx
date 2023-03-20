import {NextApiRequest, NextApiResponse} from "next";
import {completeTransfer} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const result = await completeTransfer(req.body)
    if(result.code >= 400) res.status(400).send(result.data)
    res.status(200).send(result.data)
}