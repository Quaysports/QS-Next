import {getBrandsForSupplier} from "../../../server-modules/shop/shop-order-tool";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log(req.body)
    res.status(200).send(
        await getBrandsForSupplier(req.body)
    )
}