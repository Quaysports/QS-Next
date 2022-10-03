import {get} from "../../../server-modules/shipping/shipping";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    let query = {$and: [{ISCOMPOSITE:false}, {MONTHSTOCKHIST:{$exists:true}}]};
    res.status(200).json(await get(query))
}