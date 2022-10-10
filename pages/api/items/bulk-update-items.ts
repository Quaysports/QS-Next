import {NextApiRequest, NextApiResponse} from "next";
import {bulkUpdateItems} from "../../../server-modules/mongo-interface/mongo-interface";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    res.status(200).send(
        await bulkUpdateItems(req.body)
    )
}