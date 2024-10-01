import { ObjectId } from 'mongodb';
import * as mongoI from '../mongo-interface/mongo-interface';

export interface Fees {
    _id?: string | ObjectId;
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
    amazon: boolean;
    onbuy: boolean
}

export const get = async () => {
    try {
        let result = await mongoI.findOne<Fees>("New-Fees");
        if (!result) {
            console.error("No document found in New-Fees collection.");
            throw new Error("No document found")
        }
        return result
    } catch (error) {
        console.error("Error fetching document from New-Fees:", error);
        throw error
    }
}

export const update = async (data: Fees) => {
    try {
        if (!data._id) {
            console.error("No _id provided for update operation.");
            throw new Error("Missing _id for update operation");
        }
        let query = {_id: new ObjectId(data._id)};
        delete data._id
        const result =  await mongoI.setData("New-Fees", query, data)
        if (result?.modifiedCount === 0) {
            console.error("No document was updated. Please check if the document exists.");
            throw new Error("Update failed: No documents matched the query");
        }
        return result
    } catch (error) {
        console.error("Error updating document from New-Fees:", error);
        throw error
    }
}