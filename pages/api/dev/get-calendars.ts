import {NextApiRequest, NextApiResponse} from "next";
import {getCalendars} from "../../../server-modules/dev/dev";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await getCalendars())
}