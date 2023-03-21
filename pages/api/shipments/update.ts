import {Shipment, ShipmentItem, updateShipment} from "../../../server-modules/shipping/shipping";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    let shipment:Shipment = req.body
    let data = await updateShipment(shipment)
    let opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
        },
        body: JSON.stringify({skuList: skuList(shipment.data)})
    }
    await fetch("http://localhost:4000/Items/UpdateItemStock", opts)
    res.status(200).json(data)
}

const skuList = (data:ShipmentItem[]) => {
    let uniqueSkus = new Set(data.map(item => item.sku))
    let str = ""
    for (let sku of uniqueSkus) {
        str = str === '' ? `'${sku}'` : str + `,'${sku}'`
    }
    return str
}