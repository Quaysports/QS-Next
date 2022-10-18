import {deleteQuickLinks} from "../../../server-modules/shop/shop";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    await deleteQuickLinks(JSON.parse(req.body))
    res.status(200)
}