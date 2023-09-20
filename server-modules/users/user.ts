import * as mongoI from '../mongo-interface/mongo-interface';
import {ObjectId} from "mongodb";
import {schema} from "../../types";

export interface User {
    theme: UserTheme;
    _id?: string;
    username: string;
    pin: string;
    password: string;
    role: string;
    rota: string;
    sharedRota: string;
    colour: string;
    permissions: Permissions;
    settings: Settings;
    holiday: UserHoliday[];
    sick: UserSick;
}

export interface UserHoliday {
    year: number;
    days: number;
}

export interface UserSick {
    paid: {year:number, days: number}[];
    unpaid: {year:number, days: number}[];
}

export interface UserTheme {
    [key: string]: string;
}

export interface Permissions {
    [x: string]: any;
    webpages?: { auth: boolean };
    stockTakeList?: { auth: boolean };
    stockTransfer?: { auth: boolean };
    marginCalculator?: { auth: boolean };
    shipments?: { auth: boolean };
    stockForecast?: { auth: boolean };
    itemDatabase?: { auth: boolean };
    reports?: { auth: boolean };
    salesReport?: { auth: boolean };
    shopOrders?: { auth: boolean };
    shopTills?: { auth: boolean };
    shopTillsQuickLinks?: { auth: boolean };
    users?: { auth: boolean };
    orderSearch?: { auth: boolean };
    priceUpdates?: { auth: boolean };
    shop?: { auth: boolean };
    baitOrdering?: { auth: boolean };
    online?: { auth: boolean };
    rotas?: { auth: boolean };
    holidays?: { auth: boolean };
    holidaysEdit?: { auth: boolean };
}



export interface Settings {
    marginCalculator?: MarginSettings
    dashboard?: DashboardSettings
}

export interface MarginSettings {
    tables: MarginCalcTables
    displayTitles: boolean
    displayRetail: boolean
    displayPackaging: boolean
}

export interface MarginCalcTables{
    InfoTable: boolean
    PricesTable: boolean
    StatsTable: boolean
    CostsTable: boolean
    EbayTable: boolean
    AmazonTable: boolean
    MagentoTable: boolean
    ShopTable: boolean
    MiscTable: boolean
}

export interface DashboardSettings {
    holiday:{location: "shop" | "online"}
}

export const auth = async (code: string) => {
    return await mongoI.findOne<User>("Users", {pin: {$eq: code}})
}

//used in session auth
export const login = async (user: string, password: string) => {

    const result = await mongoI.findOne<User>("Users",
        {username: {$eq: user}, password: {$eq: password}},
        {username: 1, role: 1, rota: 1, permissions: 1, theme: 1})
    if (result) {
        return {...result, auth: true}
    } else {
        return {auth: false}
    }
}

export const pinLogin = async (pin: string) => {
    const result = await mongoI.findOne<User>("Users",
        {pin: {$eq: pin}},
        {username: 1, role: 1, rota: 1, permissions: 1, theme: 1})
    if (result) {
        return {...result, auth: true}
    } else {
        return {auth: false}
    }
}

export const getUsers = async (query?: object) => {
    return await mongoI.find<User>("Users", query)
}

export const getUsersHoliday = async () => {
    return await mongoI.find<User>("Users", {}, {
        username: 1,
        holiday: 1,
        colour: 1,
        rota: 1
    })
}


export const getUserSettings = async (username?: string) => {
    return await mongoI.findOne<User>("Users", {username:username},{settings:1})
}

export const getUserDetails = async (username?: string) => {
    return await mongoI.findOne<{ settings:Settings, theme:UserTheme }>("Users", {username:username},{settings:1, theme:1})
}

export const updateUser = async (data: User) => {
    if (data._id) delete data._id
    return await mongoI.setData("Users", {username: {$eq: data.username}}, data)
}

export const deleteUser = async (data: User) => {
    let query;
    if (data._id) {
        query = {_id: new ObjectId(data._id)}
    } else {
        query = {username: {$eq: data.username}}
    }
    return await mongoI.deleteOne("Users", query)
}

export const getAllExistingCalendars = async (req: { location: string; }) => {
    return await mongoI.find<any>("Holiday-Calendar", {location: req.location}, {year: 1})
}

export const getHolidayCalendar = async (req: { year: number; location: string; }) => {
    if (req.location === "both") {
        return await mongoI.find("Holiday-Calendar", { $and: [{ year: {$eq: req.year} }, { location: { $in: ['online', 'shop'] } }] })
    } else {
        return await mongoI.findOne<any>("Holiday-Calendar", {$and: [{year: {$eq: req.year}}, {location: {$eq: req.location}}]})
    }
}

export const getHolidayYearsForLocation = async (location: string) => {
    if (location === "both") {
        let years = await mongoI.findDistinct("Holiday-Calendar", "year", { $and : [{location: {$in: ["online", "both"]}}]})
        return years ? years : [];
    } else {
        let years = await mongoI.findDistinct("Holiday-Calendar", "year", {location:location})
        return years ? years : [];
    }
}

export const getListOfHolidayYears = async (location:string) => {
    if (location === "both") {
        let years = await mongoI.findDistinct("Holiday-Calendar", "year", { $and : [{location: {$in: ["online", "both"]}}]})
        return years ? years : [];
    } else {
        let years = await mongoI.findDistinct("Holiday-Calendar", "year", {location:location})
        return years ? years : [];
    }
}

export const updateHolidayCalendar = async (data: schema.HolidayCalendar) => {
    if (data._id !== undefined) delete data._id
    await mongoI.setData("Holiday-Calendar", {$and: [{year: {$eq: data.year}}, {location: {$eq: data.location}}]}, data)
}