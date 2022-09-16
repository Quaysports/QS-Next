import {getCompleteOrders} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req, res) {
    res.status(200).json(
        await getCompleteOrders(req.body.start, req.body.end)
    )
}