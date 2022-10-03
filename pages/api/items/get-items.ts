import {getItems} from "../../../server-modules/items/items";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    req.body.filter ??= {}
    req.body.projection ??= {}
    req.body.sort ??= {}
    res.status(200).send(
        await getItems(req.body.filter,req.body.projection, req.body.sort)
    )
}