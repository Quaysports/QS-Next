import {deleteUser} from "../../../server-modules/users/user";

export default async function handler(req, res) {
    await deleteUser(JSON.parse(req.body))
    res.status(200).json()
}