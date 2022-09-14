import {deleteUser} from "../../../server-modules/users/user";

export default async function handler(req, res) {
    console.log(req.body)
    let result = await deleteUser(JSON.parse(req.body))
    console.log(result)
    res.status(200).json()
}