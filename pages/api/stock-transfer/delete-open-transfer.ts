import {NextApiRequest, NextApiResponse} from "next";
import {deleteOpenTransfer} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    await deleteOpenTransfer()
    res.status(200).send({})
}