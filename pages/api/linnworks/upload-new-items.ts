import {NextApiRequest, NextApiResponse} from "next";
import {createNewItems} from "../../../server-modules/linn-api/linn-api";
import {schema} from "../../../types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const error:string[] = []
    const items = req.body
    items.forEach((item:schema.Item) => {
        if(!item.SKU.trim() || !item.EAN.trim() || !item.title.trim() || item.prices.purchase <= 0 || !item.brand){
            error.push("Input Error")
        }
    })
    if(!error[0]) {
        let result = await createNewItems(items)
        if(result.length > 0){
            res.status(300).json(result)
        } else {
            res.status(200).json(result)
        }
    } else {
        res.status(400).json(error)
    }
}