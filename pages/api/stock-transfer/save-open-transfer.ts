import {NextApiRequest, NextApiResponse} from "next";
import {saveOpenTransfer, TransferObject} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const result = await saveOpenTransfer(req.body)
    res.status(result.code).send({})
}