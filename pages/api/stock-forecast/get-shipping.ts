import {get} from "../../../server-modules/shipping/shipping";

export default async function handler(req, res) {
    let query = {$and: [{ISCOMPOSITE:false}, {MONTHSTOCKHIST:{$exists:true}}]};
    res.status(200).json(await get(query))
}