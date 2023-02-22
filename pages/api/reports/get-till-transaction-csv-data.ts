import {NextApiRequest, NextApiResponse} from "next";
import {getTillTransactionCSVData} from "../../../server-modules/shop/shop";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await getTillTransactionCSVData(req.body))
}