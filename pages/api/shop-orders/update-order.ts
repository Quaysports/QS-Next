import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import {NextApiRequest, NextApiResponse} from "next";
import {shopOrder} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(
        await shopStockOrder(req.body)
    )
}

export const shopStockOrder = async (order:shopOrder) => {
    if (order._id !== undefined) delete order._id
    return await mongoI.setData("New-New-Shop-Orders", {date: order.date}, order)
}