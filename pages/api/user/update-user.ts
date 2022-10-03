import {updateUser} from "../../../server-modules/users/user";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    await updateUser(JSON.parse(req.body))
    res.status(200)
}