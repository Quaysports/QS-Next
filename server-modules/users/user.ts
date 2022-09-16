import * as mongoI from '../mongo-interface/mongo-interface';

export interface user {
    theme: { [key:string]: string };
    _id?: string;
    username: string;
    pin?: string;
    password?: string;
    role: string;
    rota?: string;
    colour?: string;
    permissions: Permissions;
    holiday?: string;
}

export interface Permissions {
    webpages: { auth: boolean, label: "Webpages" };
    stockTakeList: { auth: boolean, label: "Stock Take List" };
    stockTransfer: { auth: boolean, label: "Stock Transfer" };
    marginCalculator: { auth: boolean, label: "Margin Calculator" };
    shipments: { auth: boolean, label: "Shipments" };
    stockForecast: { auth: boolean, label: "Stock Forecast" };
    itemDatabase: { auth: boolean, label: "Item Database" };
    incorrectStock: { auth: boolean, label: "Incorrect Stock" };
    shopOrders: { auth: boolean, label: "Shop Orders" };
    users: { auth: boolean, label: "Users" };
    orderSearch: { auth: boolean, label: "Order Search" };
    priceUpdates: { auth: boolean, label: "Price Updates" };
    shop: { auth: boolean, label: "Shop" };
    baitOrdering: { auth: boolean, label: "Bait Orders" };
    online: { auth: boolean, label: "Online" };
    rotas: { auth: boolean, label: "Rotas" };
    holidays: { auth: boolean, label: "Holidays" };
}

export const auth = async (code: string) => {
    return await mongoI.findOne<user>("Users", {pin: {$eq: code}})
}

//used in session auth
export const login = async (user: string, password: string) => {

    const result = await mongoI.findOne<user>("Users",
        {username: {$eq: user}, password: {$eq: password}},
        {username: 1, role: 1, rota: 1, permissions: 1, theme:1})
    if (result) {
        return {...result, auth: true}
    } else {
        return {auth: false}
    }
}

export const getUsers = async (query?: object) => {
    return await mongoI.find<user>("Users", query)
}

export const updateUser = async (data: user) => {
    if (data._id) delete data._id
    return await mongoI.setData("Users", {username: {$eq: data.username}}, data)
}

export const deleteUser = async (data: user) => {
    return await mongoI.deleteOne("Users", {username: {$eq: data.username}})
}

export const getAllExistingCalendars = async (req: { location: string; }) => {
    return await mongoI.find<any>("Holiday-Calendar", {location: req.location}, {year: 1})
}

export const getHolidayCalendar = async (req: { year: number; location: string; }) => {
    return await mongoI.findOne<any>("Holiday-Calendar", {$and: [{year: {$eq: req.year}}, {location: {$eq: req.location}}]})
}

export const updateHolidayCalendar = async (data: sbt.holidayCalendar) => {
    if (data._id !== undefined) delete data._id
    await mongoI.setData("Holiday-Calendar", {$and: [{year: {$eq: data.year}}, {location: {$eq: data.location}}]}, data)
}