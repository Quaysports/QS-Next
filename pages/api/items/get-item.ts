import {getItem} from "../../../server-modules/items/items";

export default async function handler(req, res){
    req.body.projection ??= {}
    res.status(200).send(
        await getItem(req.body.filter,req.body.projection)
    )
}