import {NextApiRequest, NextApiResponse} from "next";
import {getRotaTemplate} from "../../../server-modules/rotas/rotas";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await getRotaTemplate(req.body))
}