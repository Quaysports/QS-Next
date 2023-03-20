import {NextApiRequest, NextApiResponse} from "next";
import {saveOpenTransfer, TransferObject} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const transferObject:TransferObject = {
        items:req.body,
        complete: false,
        transferID: "",
        transferRef: "",
        date:""
    }
    const result = await saveOpenTransfer(transferObject)
    res.status(result.code).send({})
}