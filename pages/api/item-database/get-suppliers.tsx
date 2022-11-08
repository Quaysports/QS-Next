import {NextApiRequest, NextApiResponse} from "next";
import {getDefaultSuppliers} from "../../../server-modules/items/items";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    res.status(200).send(
        await getDefaultSuppliers()
    )
}