import {getItems} from "../../../server-modules/items/items";

export default async function handler(req, res) {
    let query = {"BRANDLABEL.loc": {$exists: true, $ne: ""}}
    let projection = {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, "BRANDLABEL.loc": 1}
    res.status(200).send(
        await getItems(query, projection)
    )
}