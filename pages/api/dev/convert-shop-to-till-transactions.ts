import {NextApiRequest, NextApiResponse} from "next";
import {convertShopToTillTransactions} from "../../../server-modules/dev/dev";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await convertShopToTillTransactions())
}