import {NextApiRequest, NextApiResponse} from "next";
import {getOpenOrders} from "../../../server-modules/shop/shop-order-tool";

;

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(
        await getOpenOrders()
    )
}

