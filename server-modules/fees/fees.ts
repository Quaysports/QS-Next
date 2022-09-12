const objectId = require('mongodb').ObjectID;
import mongoI = require('../mongo-interface/mongo-interface');

interface Fees {
    _id?: { $oid: string };
    LISTING: Listing;
    FLAT: Flat
    VATAPP: VatApplicable
    VAT: number;
    LASTUPDATE: string;
    SUBSCRIPTION: Subscription
}

interface Listing { SHOP: string; QS: string; EBAY: string; AMAZ: string }
interface Flat { SHOP: string; QS: string; EBAY: string; AMAZ: string }
interface Subscription { SHOP: string; QS: string; EBAY: string; AMAZ: string }
interface VatApplicable { SHOP: boolean; QS: boolean; EBAY: boolean; AMAZ: boolean }

let fd:Fees

export const init = async () => fd = await get();

export const get = async () => {
    let result = await mongoI.findOne<Fees>("Fees")
    return result!
}

export const update = async (data:Fees) => {
        let query = { _id: objectId(data._id) };
        delete data._id
        const results = await mongoI.setData("Fees", query, data)
        await init()
        return results
}

export const calc = (id: string, price: number) => {
    let per = parseFloat(fd.LISTING[id as keyof Listing]) > 0 ? price * (parseFloat(fd.LISTING[id as keyof Listing]) / 100) : 0;
    let flat = parseFloat(fd.FLAT[id as keyof Flat])
    let sub = parseFloat(fd.SUBSCRIPTION[id as keyof Subscription])
    return per + flat + sub;
}

export const VAT = ()=> {
    return fd?.VAT
}
