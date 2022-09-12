import * as mongoI from '../../server-modules/mongo-interface/mongo-interface'

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

export default async function handler(req, res) {
    res.status(200).json(
        await deleteOrder(req.body)
    )
}

export const deleteOrder = async (order:shopOrder) => {
    return await mongoI.deleteOne("Shop-Orders", {date: order.date})
}