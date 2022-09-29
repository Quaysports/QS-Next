import {getItem} from "../../../server-modules/items/items";

export default async function handler(req, res){
    console.log(req)
    res.status(200).send(
        await getItem(req.body,{})
    )
}