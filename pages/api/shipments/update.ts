import {updateShipment} from "../../../server-modules/shipping/shipping";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await updateShipment(req.body))
}