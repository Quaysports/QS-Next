import {NextApiRequest, NextApiResponse} from "next";
import {updateHolidayCalendar} from "../../../server-modules/users/user";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    res.status(200).json(await updateHolidayCalendar(req.body))
}