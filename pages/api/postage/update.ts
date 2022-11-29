import {NextApiRequest, NextApiResponse} from "next";
import {update} from "../../../server-modules/postage/postage";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await update(req.body))
}