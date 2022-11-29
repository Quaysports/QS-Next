const objectId = require('mongodb').ObjectID;
import * as mongoI from '../mongo-interface/mongo-interface';

export interface Fees {
    _id?: { $oid: string };
    LISTING: Listing;
    FLAT: Flat
    VATAPP: VatApplicable
    VAT: number;
    LASTUPDATE: string;
    SUBSCRIPTION: Subscription
}

export interface Listing {
    SHOP: string;
    QS: string;
    EBAY: string;
    AMAZ: string
}

export interface Flat {
    SHOP: string;
    QS: string;
    EBAY: string;
    AMAZ: string
}

export interface Subscription {
    SHOP: string;
    QS: string;
    EBAY: string;
    AMAZ: string
}

export interface VatApplicable {
    SHOP: boolean;
    QS: boolean;
    EBAY: boolean;
    AMAZ: boolean
}

export const get = async () => {
    let result = await mongoI.findOne<Fees>("Fees")
    return result!
}

export const update = async (data: Fees) => {
    let query = {_id: objectId(data._id)};
    delete data._id
    return await mongoI.setData("Fees", query, data)
}