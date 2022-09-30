import {updateItem} from "../../../server-modules/items/items";

export default async function handler(req, res){
    res.status(200).send(
        await updateItem(req.body)
    )
}