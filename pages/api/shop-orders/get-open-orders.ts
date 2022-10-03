import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import {NextApiRequest, NextApiResponse} from "next";
import {shopOrder} from "../../../server-modules/shop/shop-order-tool";

;

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(
        await getOpenOrders()
    )
}

export const getOpenOrders = async () => {
    return await mongoI.find<shopOrder>("New-Shop-Orders", {complete: false})
}