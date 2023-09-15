import * as mongoI from '../mongo-interface/mongo-interface';
import {setData} from "../mongo-interface/mongo-interface";
import {ObjectId} from "mongodb";
import {schema} from "../../types";

export interface Rota{
    _id?:string
    name: string
    location: string
    rota: UserHours[][]
}

export interface WeekData {
    monday: string
    days: string[]
    week: number
}

export interface PublishedRota extends Rota {
    weekData: WeekData
    holidays: schema.HolidayDay[] | null
}

export interface UserHours {
    username: string
    colour: string
    total: number

    notes: string
    hours: {
        "06:00": boolean,
        "06:30": boolean,
        "07:00": boolean,
        "07:30": boolean,
        "08:00": boolean,
        "08:30": boolean,
        "09:00": boolean,
        "09:30": boolean,
        "10:00": boolean,
        "10:30": boolean,
        "11:00": boolean,
        "11:30": boolean,
        "12:00": boolean,
        "12:30": boolean,
        "13:00": boolean,
        "13:30": boolean,
        "14:00": boolean,
        "14:30": boolean,
        "15:00": boolean,
        "15:30": boolean,
        "16:00": boolean,
        "16:30": boolean,
        "17:00": boolean,
        "17:30": boolean,
        "18:00": boolean,
        "18:30": boolean,
    }
}

export const getRotaNames = async (query: string) => {
    if (query === "both") {
        return await mongoI.find<{ username: string, colour: string }>("Users", {rota: {$in: ["shop", "online"]}}, {
            username: 1,
            colour: 1
        })
    } else {
        return await mongoI.find<{ username: string, colour: string }>("Users", {rota: {$eq: query}}, {
            username: 1,
            colour: 1
        })
    }
}

export const publishRota = async (data:PublishedRota) => {
    if(data._id !== undefined) delete data._id;
    return await mongoI.setData(
        "Published-Rotas",
        {$and: [{"weekData.monday": {$eq: data.weekData.monday}}, {location: data.location}]},
        data)
}

export const getPublishedRotas = async (location:string, date:string) => {
    return await mongoI.find<PublishedRota>(
        "Published-Rotas",
        {location:location, "weekData.monday":{$gt:  date}},
        {},
        {"weekData.week": 1})
}

export const deletePublishedRotas = async (rota:PublishedRota) => {
    return await mongoI.deleteOne(
        "Published-Rotas",
        {$and: [{"weekData.monday": {$eq: rota.weekData.monday}}, {location: rota.location}]})
}

export const updateRotaTemplate = async (data:Rota) => {
    if (data._id !== undefined) delete data._id;
    return await setData("Rota-Templates", {name: {$eq: data.name}}, data)
}

export const getRotaTemplates = async (location:string) => {
    return await mongoI.findDistinct("Rota-Templates", "name", {location: {$eq: location}})
}

export const getRotaTemplate = async (name:string) => {
    return await mongoI.findOne<Rota>("Rota-Templates", {name: {$eq: name}})
}

export const deleteRotaTemplate = async (rota:Rota) => {
    let query;
    if (rota._id !== undefined){
        query = {_id: new ObjectId(rota._id)}
        delete rota._id
    } else {
        query = {name: {$eq: rota.name}}
    }
    return await mongoI.deleteOne("Rota-Templates", query)
}