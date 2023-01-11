import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import {NextApiRequest, NextApiResponse} from "next";
import {shopOrder} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(
        await deleteOrder(req.body.order)
    )
}

export const deleteOrder = async (order:shopOrder) => {
    return await mongoI.deleteOne("New-New-Shop-Orders", {date: order.date})
}