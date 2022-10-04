import {updateQuickLinks} from "../../../server-modules/shop/shop";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).send(await updateQuickLinks(JSON.parse(req.body)))
}