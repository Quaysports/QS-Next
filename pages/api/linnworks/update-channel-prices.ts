import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const opts = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
        },
        body: JSON.stringify(req.body)
    }

    console.dir(opts)

    let result = await fetch("http://localhost:3001/Linn/UpdateLinnChannelPrices", opts)
    res.status(200).json(await result.json())
}