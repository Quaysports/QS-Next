import {NextApiRequest, NextApiResponse} from "next";
import {deleteImage} from "../../../server-modules/items/items";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    let body = JSON.parse(req.body)
    res.status(200).send(
        await deleteImage(body.id, body.item)
    )
}