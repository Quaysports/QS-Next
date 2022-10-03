import {getItems} from "../../../server-modules/items/items";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    let query = {"BRANDLABEL.loc": {$exists: true, $ne: ""}}
    let projection = {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, "BRANDLABEL.loc": 1}
    res.status(200).send(
        await getItems(query, projection)
    )
}