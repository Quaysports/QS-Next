import * as mongoI from '../mongo-interface/mongo-interface';

export interface Postage {
    _id?: { $oid: string };
    format: string;
    id: string;
    vendor: string;
    cost: number;
    tag: string;
}

export const get = async ()=> {
    return await mongoI.find<Postage>("New-Postage")
}

export const update = async (data:Postage) => {
    if (data._id !== undefined) delete data._id;
    return await mongoI.setData("New-Postage", {format: data.format}, data)
}

export const remove = async (data:Postage) => {
    if (data._id !== undefined) delete data._id
    return mongoI.deleteOne("Postage", {format: data.format})
}