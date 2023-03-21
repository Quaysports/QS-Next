import {NextApiRequest, NextApiResponse} from "next";
import {saveCompleteTransfer} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const result = await saveCompleteTransfer(req.body)
    res.status(result.code).send({})
}