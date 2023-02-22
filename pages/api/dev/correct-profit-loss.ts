import {correctProfitLoss} from "../../../server-modules/dev/dev";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await correctProfitLoss())
}