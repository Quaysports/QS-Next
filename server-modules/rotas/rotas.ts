import * as mongoI from '../mongo-interface/mongo-interface';
import {setData} from "../mongo-interface/mongo-interface";

interface rota {
    _id?: { $oid: string };
    loc: string;
    weekData: { week: number; days: string[]; monday: string };
    rota: {
        "0": {totals:totals} & {[key: string]:schedule}
        "1": {totals:totals} & {[key: string]:schedule}
        "2": {totals:totals} & {[key: string]:schedule}
        "3": {totals:totals} & {[key: string]:schedule}
        "4": {totals:totals} & {[key: string]:schedule}
        "5": {totals:totals} & {[key: string]:schedule}
        "6": {totals:totals} & {[key: string]:schedule}
    };
    id: string;
}

interface totals {
    [key: string]: number
}

interface schedule {
        "600": string,
        "630": string,
        "700": string,
        "730": string,
        "800": string,
        "830": string,
        "900": string,
        "930": string,
        "1000": string,
        "1030": string,
        "1100": string,
        "1130": string,
        "1200": string,
        "1230": string,
        "1300": string,
        "1330": string,
        "1400": string,
        "1430": string,
        "1500": string,
        "1530": string,
        "1600": string,
        "1630": string,
        "1700": string,
        "1730": string,
        "1800": string,
        "1830": string
}

export const getRotaNames = async (query: string) => {
    return await mongoI.find<{ username: string, colour: string }>("Users", {rota: {$eq: query}}, {
        username: 1,
        colour: 1
    })
}

export const publishRota = async (data:rota) => {
    if (data._id !== undefined) delete data._id
    return await mongoI.setData(
        "Published-Rotas",
        {$and: [{"weekData.monday": {$eq: data.weekData.monday}}, {loc: data.loc}]},
        data)
}

export const getPublishedRotas = async (query:object) => {
    return await mongoI.find<rota>("Published-Rotas", query, {}, {"weekData.monday": 1})
}

export const updateRotaTemplate = async (data:rota) => {
    if (data._id !== undefined) delete data._id;
    return await setData("Rota-Templates", {id: {$eq: data.id}}, data)
}

export const getRotaTemplates = async (loc:string) => {
    return await mongoI.find<rota>("Rota-Templates", {loc: loc})
}
