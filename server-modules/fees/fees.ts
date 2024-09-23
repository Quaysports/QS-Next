const objectId = require('mongodb').ObjectID;
import * as mongoI from '../mongo-interface/mongo-interface';

export interface Fees {
    _id?: { $oid: string };
    listing: Channels;
    flat: Channels
    vatApplicable: VatApplicable
    VAT: number;
    lastUpdate: string;
    subscription: Channels
}

export interface Channels {
    shop: number;
    magento: number;
    ebay: number;
    amazon: number;
    onbuy: number;
}

export interface VatApplicable {
    shop: boolean;
    magento: boolean;
    ebay: boolean;
    amazon: boolean
}

export const get = async () => {
    let result = await mongoI.findOne<Fees>("New-Fees")
    return result!
}

export const update = async (data: Fees) => {
    let query = {_id: objectId(data._id)};
    delete data._id
    return await mongoI.setData("New-Fees", query, data)
}