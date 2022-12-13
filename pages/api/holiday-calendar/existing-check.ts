
import {NextApiRequest, NextApiResponse} from "next";
import {getListOfHolidayYears} from "../../../server-modules/users/user";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const {year, location} = req.body as {year: number, location: string}

    const years = await getListOfHolidayYears(location)

    res.status(200).send(years.includes(year))
}