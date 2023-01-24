import {NextApiRequest, NextApiResponse} from "next";
import {getItem} from "../../../server-modules/items/items";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const SKU = req.body.item.SKU
    const opt = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
        },
        body:JSON.stringify(req.body)
    }

    
    const json = await fetch('http://localhost:4000/Items/DeleteImage', opt)
    const result = await json.json()
    if(result.status === "Deleted"){
        res.send(await getItem({SKU:SKU}))
    } else {
        res.send(400)
    }

}