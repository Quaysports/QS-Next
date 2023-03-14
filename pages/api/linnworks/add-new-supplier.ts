import {NextApiRequest, NextApiResponse} from "next";
import {addNewSupplier} from "../../../server-modules/linn-api/linn-api";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const supplierRes = await addNewSupplier(req.body)
    res.status(supplierRes.code).json(supplierRes.message)
}