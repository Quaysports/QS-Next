import {getBrandsForSupplier} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req, res) {
    console.log(req.body)
    res.status(200).send(
        await getBrandsForSupplier(req.body)
    )
}