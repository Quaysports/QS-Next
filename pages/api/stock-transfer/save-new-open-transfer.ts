import {NextApiRequest, NextApiResponse} from "next";
import {saveOpenTransfer, TransferObject} from "../../../server-modules/stock-transfer/stock-transfer";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const transfer:TransferObject= {
        _id: "",
        complete: false,
        completedDate: "",
        createdDate: req.body.date,
        items: [...req.body.items],
        transferID: "",
        transferRef: ""
    }

    const result = await saveOpenTransfer(transfer)
    res.status(result.code).send({})
}