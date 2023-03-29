//import {convertPricesToThousands} from "../../../server-modules/dev/dev";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    // do not run on production
    //res.status(200).json(await convertPricesToThousands())
}