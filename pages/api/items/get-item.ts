import {getItem} from "../../../server-modules/items/items";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    req.body.projection ??= {}
    res.status(200).send(
        await getItem(req.body.filter,req.body.projection)
    )
}