import {NextApiRequest, NextApiResponse} from "next";
import {updateRotaTemplate} from "../../../server-modules/rotas/rotas";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await updateRotaTemplate(req.body))
}