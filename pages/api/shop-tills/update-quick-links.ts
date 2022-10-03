import {updateQuickLinks} from "../../../server-modules/shop/shop";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log(JSON.parse(req.body))
    await updateQuickLinks(JSON.parse(req.body))
    res.status(200)
}