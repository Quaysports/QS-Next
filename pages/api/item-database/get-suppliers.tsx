import {getSuppliers} from "../../../server-modules/shop/shop-order-tool";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    res.status(200).send(
        await getSuppliers()
    )
}