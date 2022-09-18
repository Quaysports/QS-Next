import {updateUser} from "../../../server-modules/users/user";

export default async function handler(req, res) {
    await updateUser(JSON.parse(req.body))
    res.status(200).json()
}