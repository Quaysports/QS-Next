import {adjustStock} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req, res) {
    res.status(200).send(
        await adjustStock(req.body.DATA, req.body.QUERY)
    )
}