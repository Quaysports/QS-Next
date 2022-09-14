import {getUsers} from "../../../server-modules/users/user";

export default async function handler(req, res) {
    res.status(200).json(
        await getUsers(req.body)
    )
}