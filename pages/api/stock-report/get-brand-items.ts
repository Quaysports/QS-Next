import {getItems} from "../../../server-modules/items/items";

export default async function handler(req, res) {
    res.status(200).send(await getItems({"IDBEP.BRAND":req.body, IDBFILTER:"domestic", ISCOMPOSITE:false}, {SKU:1, TITLE:1,EAN:1, STOCKTOTAL:1}))
}