import {NextApiRequest, NextApiResponse} from "next";
import {getAllBrands} from "../../../server-modules/items/items";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await getAllBrands())
}