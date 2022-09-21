import {getSupplierItems} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req, res) {
    res.status(200).json(
        await getSupplierItems(req.body.supplier)
    )
}