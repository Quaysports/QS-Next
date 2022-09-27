import {deleteQuickLinks} from "../../../server-modules/shop/shop";

export default async function handler(req, res) {
    console.log(JSON.parse(req.body))
    await deleteQuickLinks(JSON.parse(req.body))
    res.status(200).json()
}