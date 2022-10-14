import {NextApiRequest, NextApiResponse} from "next";
import {adjustStock} from "../../../server-modules/linn-api/linn-api";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    let updateData = []
    for (let item of req.body.data) {
        updateData.push( {
            "SKU": item.SKU,
            "LocationId": "00000000-0000-0000-0000-000000000000",
            "Level": item.QTY
        })
    }

    let data = await adjustStock(updateData, req.body.id)
    res.status(200).json(data)
}