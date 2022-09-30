import {getItems} from "../../../server-modules/items/items";

export default async function handler(req, res){
    req.body.filter ??= {}
    req.body.projection ??= {}
    req.body.sort ??= {}
    res.status(200).send(
        await getItems(req.body.filter,req.body.projection, req.body.sort)
    )
}