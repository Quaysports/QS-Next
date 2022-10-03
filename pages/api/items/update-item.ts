import {updateItem} from "../../../server-modules/items/items";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    res.status(200).send(
        await updateItem(req.body)
    )
}