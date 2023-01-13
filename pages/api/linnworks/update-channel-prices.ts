import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    interface Options{
        method:string
        headers: {[key:string]:string}
        body?:string
    }

    const opts:Options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
        }
    }

    if(req.body) opts.body = JSON.stringify(req.body)

    let result = await fetch("http://localhost:4000/Items/UpdateLinnworksChannelPrices", opts)
    res.status(200).json(await result.json())
}