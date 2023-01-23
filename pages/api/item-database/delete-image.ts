import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    console.log(req.body)
    const opt = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
        },
        body:JSON.stringify(req.body)
    }

    const result = await fetch('http://localhost:4000/Items/DeleteImage', opt)

    res.send(result)
}