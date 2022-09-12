import mongoI = require('../mongo-interface/mongo-interface');
import Core = require('../core/core')
const config = require('../../../config/config.json')

interface sessions {
    [key:string]:user
}
interface user {
    _id?:string,
    username: string,
    pin?:string
    password?:string
    role: string,
    rota?: string,
    colour?:string
    permissions: Permissions
    holiday?:string
}
export interface Permissions {
    users:{auth:boolean, label:"Users"},
    orderSearch:{auth:boolean, label:"Order Search"},
    priceUpdates:{auth:boolean, label:"Price Updates"},
    shop:{auth:boolean, label:"Shop"},
    baitOrdering:{auth:boolean, label:"Bait Orders"},
    online:{auth:boolean, label:"Online"},
    rotas:{auth:boolean, label:"Rotas"},
    holidays:{auth:boolean, label:"Holidays"}
}

let sessions: sessions = {}

export const auth = async (code: string) => {
    return await mongoI.findOne<user>("Users", {pin: {$eq: code}})
}

export const admin = (id: string) => {
    return sessions[id].role === 'admin';
}

export const permissions = (id: string) => {
    return sessions[id].permissions
}

export const rota = (id: string) => {
    return sessions[id].rota;
}

export const check = (id: string) => {
    return sessions[id] !== undefined
}

export const logout = (id: string) => {
    delete sessions[id]
}

export const token = (token: string) => {
    return config.tokens[token]
}

export const login = async (user: string, password: string) => {

    const result = await mongoI.findOne<user>("Users",
        { username: { $eq: user }, password: { $eq: password }},
        {username: 1, role: 1, rota: 1, permissions: 1})

    if (result) {
        const guidToken: string = Core.guid()
        sessions[guidToken] = result
        // 24 hours = 86400000
        setTimeout(() => { logout(guidToken) }, 86400000)
        return { auth: true, user: result.username, rota: result.rota, token: guidToken }
    } else {
        return { auth: false, user: "", rota: {}, token: ""}
    }
}

export const getUsers = async (query: object) => {
    return await mongoI.find<any>("Users", query)
}

export const getUsersHoliday = async (query: object) => {
    return await mongoI.find<any>("Users", query, {
        username: 1,
        holiday: 1,
        colour: 1,
        rota: 1
    })
}

export const updateUser = async (data: user) => {
    if (data._id) delete data._id
    return await mongoI.setData("Users", {username: {$eq: data.username}}, data)
}

export const getAllExistingCalendars = async (req: { location: string; }) => {
    return await mongoI.find<any>("Holiday-Calendar", {location: req.location}, {year: 1})
}

export const getHolidayCalendar = async (req: { year: number; location: string; }) => {
    return await mongoI.findOne<any>("Holiday-Calendar", {$and: [{year: {$eq: req.year}}, {location: {$eq: req.location}}]})
}

export const updateHolidayCalendar = async (data: sbt.holidayCalendar) => {
        if (data._id !== undefined) delete data._id
        await mongoI.setData("Holiday-Calendar",{$and: [{year: {$eq: data.year}}, {location: {$eq: data.location}}]},data)
}
