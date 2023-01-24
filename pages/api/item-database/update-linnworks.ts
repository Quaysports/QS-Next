import {NextApiRequest, NextApiResponse} from "next";
import {
    bulkUpdateLinnItem,
} from "../../../server-modules/linn-api/linn-api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(await bulkUpdateLinnItem(req.body))
}