import * as mongoI from '../../../server-modules/mongo-interface/mongo-interface'
import shopOrder = sbt.shopOrder;

export default async function handler(req, res) {
    res.status(200).json(
        await getOpenOrders()
    )
}

export const getOpenOrders = async () => {
    return await mongoI.find<shopOrder>("New-Shop-Orders", {complete: false})
}