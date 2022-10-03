import {searchItems} from "../../../server-modules/items/items";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const query = JSON.parse(req.body)
    res.status(200).send(
        await searchItems({type:query.type, id:query.id})
    )
}