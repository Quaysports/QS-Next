import {searchItems} from "../../../server-modules/items/items";

export default async function handler(req, res) {
    const query = JSON.parse(req.body)
    res.status(200).send(
        await searchItems({type:query.type, id:query.id})
    )
}