import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import {NextApiRequest, NextApiResponse} from "next";

interface shopOrder {
    _id?: string
    arrived: orderItem[] | []
    complete: boolean
    date: number
    id: string
    price: number
    order: orderItem[] | []
    supplier: string
}

interface orderItem {
    IDBEP: { BRAND: string }
    MINSTOCK: number
    SKU: string
    STOCKTOTAL: string
    TITLE: string
    _id: string
    bookedIn: string
    qty: number
    tradePack: number
    arrived: number
    purchasePrice: number
    deadStock: boolean
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(
        await deleteOrder(req.body.order)
    )
}

export const deleteOrder = async (order:shopOrder) => {
    console.log(order)
    return await mongoI.deleteOne("New-Shop-Orders", {date: order.date})
}