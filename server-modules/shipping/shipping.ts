import * as mongoI from '../mongo-interface/mongo-interface';
const objectId = require('mongodb').ObjectId;

export interface Shipment {
    _id?: { $oid: string };
    id: number;
    bankCharges: number;
    confirmed: boolean;
    credit: number;
    data: ShipmentItem[];
    delivered: boolean;
    due: string;
    duty: number;
    exchangeRate: number;
    m3total: number;
    shipping: number;
    subTotal: number;
    tag: string;
    totalCartons: number;
    depReq: number;
    dutyPound: number;
    grandTotal: number;
    outstanding: number;
    total: number;
    totalExVat: number;
    totalPound: number;
    vat: number;
    intId: string;
    atSea: boolean;
    shippingCompany: string;
}

export interface ShipmentItem {
        dutyValue: number
        code: string
        hscode: string
        poundTotal: number
        billDesc: string;
        length: string;
        perOfOrder: number;
        dollarTotal: number;
        fobPound: number;
        qtyPerBox: string;
        fobDollar: string;
        m3perBox: number;
        dutyPer: string;
        supplier: string;
        qty: string;
        width: string;
        numOfBoxes: number;
        m3total: number;
        _id?: { $oid: string };
        sku: string;
        totalPerItem: number;
        desc: string;
        height: string
}

export interface ShippingCompany {
    _id: { $oid: string };
    company: string
}

export const get = async (query?: {} | undefined) => {
    console.log(query)
    if (query) {
        return await mongoI.find<Shipment>("Shipping", query)
    } else {
        return await mongoI.find<Shipment>("Shipping",
            {delivered: false},
            {
                id: 1,
                intId:1,
                confirmed: 1,
                data: 1,
                due: 1,
                m3total: 1,
                tag: 1,
                totalCartons: 1
            }
        )
    }
}

export const getLast = async (id: {} | undefined) => {
    return await mongoI.find<Shipment>("Shipping", {}, id, {_id: -1}, 1)
}

export const shippingCompanies = async () => {
    return await mongoI.find<ShippingCompany>("Shipping-Companies", {}, {}, {company: 1})
}

export const itemKeys = async () => {
    return await mongoI.find<ShipmentItem>("Shipping-Items", {}, {code: 1, desc: 1, sku: 1}, {sku: 1})
}

export const item = async (id: string) => {
    let query = {_id: objectId(id)};
    return await mongoI.find<ShipmentItem>("Shipping-Items", query)
}

export const update = async (data:Shipment) => {
    if (data.data) {
        for (let v of data.data) {
            if (v.code && v.sku) {
                if (v._id) delete v._id
                await mongoI.setData("Shipping-Items", {code: v.code, sku: v.sku}, v)
            }
        }
    }

    await mongoI.setData("Shipping-Companies",
        {company: data.shippingCompany},
        {company: data.shippingCompany}
    )

    if (data._id) delete data._id
    await mongoI.setData("Shipping",  { id: data.id }, data)
    return data

}

export const remove = async (coll:string, query:object) => {
        return await mongoI.deleteOne(coll,query)
}