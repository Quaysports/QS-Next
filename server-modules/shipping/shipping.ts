import {deleteOne, find, findDistinct, setData} from "../mongo-interface/mongo-interface";

export interface Shipment {
    _id?: { $oid: string };
    id: number;
    bankCharges: number;
    confirmed: boolean;
    booked: boolean;
    credit: number;
    data: ShipmentItem[];
    delivered: boolean;
    delivery:boolean;
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
    overdue: boolean;
    ready: boolean;
    total: number;
    totalExVat: number;
    totalPound: number;
    vat: number;
    intId: string;
    atSea: boolean;
    shippingCompany: string;
    shipRef:string;
}

export interface ShipmentItem {
        dutyValue: number
        code: string
        orderid: string
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
        _id?: string ;
        sku: string;
        totalPerItem: number;
        desc: string;
        height: string
}

export interface ShippingCompany {
    _id: { $oid: string };
    company: string
}

export const getShipment = async (query?: {} | undefined) => {
    console.log(query)
    if (query) {
        return await find<Shipment>("Shipping", query)
    } else {
        return await find<Shipment>("Shipping",
            {delivered: false}
        )
    }
}

export const getLast = async (id: {} | undefined) => {
    return await find<Shipment>("Shipping", {}, id, {_id: -1}, 1)
}

export const getShippingCompanies = async () => {
    return await find<ShippingCompany>("Shipping-Companies", {}, {}, {company: 1})
}

export const getItemKeys = async () => {
    return await find<Pick<ShipmentItem, "code" | "sku" | "desc">>("Shipping-Items", {}, {code: 1, desc: 1, sku: 1}, {sku: 1})
}

export const deleteShippingItem = async (data: ShipmentItem) => {
    if(data._id) delete data._id
    return await deleteOne("Shipping-Items", {code: data.code, sku: data.sku})
}

export const getSKUKeys = async ()=> {
    return await findDistinct("New-Items", "SKU", {isListingVariation:false,isComposite:false,tags: {$nin:["domestic"]}})
}

export const updateShipment = async (data:Shipment) => {
    if (data.data) {
        for (let v of data.data) {
            if (!v.code || !v.sku) continue;
            if (v._id) delete v._id
            await setData("Shipping-Items", {code: v.code, sku: v.sku}, v)
        }
    }

    await setData("Shipping-Companies",
        {company: data.shippingCompany?.trim()},
        {company: data.shippingCompany?.trim()}
    )

    if (data._id) delete data._id
    await setData("Shipping",  { id: data.id }, data)
    return data
}

export const deleteShipment = async (shipment:Shipment) => {
    if (shipment._id) delete shipment._id
    let query = {id: shipment.id}
    return await deleteOne("Shipping",query)
}