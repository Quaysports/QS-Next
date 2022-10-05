import {updateUser} from "../../../server-modules/users/user";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await updateUser(req.body))
}