import {NextApiRequest, NextApiResponse} from "next";
import {findOne, setData} from "../../../server-modules/mongo-interface/mongo-interface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {brand, prefix} = req.body
    const errors = []
    const brandLookup = await findOne<{brand:string,prefix:string}>("Brand-Prefixes", {$or:[{brand:brand}, {prefix:prefix}]})
    if(brandLookup) {
        if(brand === brandLookup.brand) errors.push("Brand name already exists")
        if(prefix === brandLookup.prefix) errors.push("Prefix already exists")
        res.status(400).json(errors)
    }
    if(!brandLookup) {
        const result = await setData("Brand-Prefixes", {brand:brand}, req.body)
        console.log(result)
        if(!result) res.status(400).json(["Database save failed, please try again"])
        if (result!.upsertedCount >= 1) res.status(200).json("New brand and prefix added")
    }
}