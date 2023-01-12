import {deleteRotaTemplate} from "../../../server-modules/rotas/rotas";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await deleteRotaTemplate(req.body))
}