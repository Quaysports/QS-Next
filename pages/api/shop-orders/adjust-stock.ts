import {adjustStock} from "../../../server-modules/shop/shop-order-tool";

export default async function handler(req, res){
    await adjustStock(req.body.DATA, req.body.QUERY).then(res)
    return res
}