import * as mongoI from '../mongo-interface/mongo-interface';

export interface Packaging {
    _id?: { $oid: string };
    id: string;
    linkedSkus: string[];
    name: string;
    type: string;
    price: number;
}

export const get = async (id?: string) => {
    return await mongoI.find<Packaging>("New-Packaging", id ? {id: id} : {})
}

export const update = async (data: Packaging) => {
    if (data._id) delete data._id
    return await mongoI.setData("New-Packaging", {id: data.id}, data)
}