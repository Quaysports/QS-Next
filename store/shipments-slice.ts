import {createAction, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {Shipment, ShipmentItem, ShippingCompany} from "../server-modules/shipping/shipping";
import {RootState} from "./store";
import {dispatchToast} from "../components/toast/dispatch-toast";

export const hydrate = createAction<RootState>(HYDRATE);

export interface shipmentWrapper {
    shipments: shipmentState
}

export interface shipmentState {
    shipments: Shipment[]
    shipment: Shipment | null
    activeShipmentIndex: string | null
    shippingCompanies: ShippingCompany[]
    itemKeys: Pick<ShipmentItem, "code" | "sku" | "desc">[]
    skuKeys: string[]
}

const initialState: shipmentState = {
    shipments: [],
    shipment: null,
    activeShipmentIndex: null,
    shippingCompanies: [],
    itemKeys: [],
    skuKeys: []
}

export const shipmentsSlice = createSlice({
        name: "shipments",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.shipments
                    };
                })
                .addDefaultCase(() => {
                })
        },
        reducers: {
            setShipments: (state, action: PayloadAction<Shipment[]>) => {
                state.shipments = action.payload
            },
            createShipment: (state) => {
                const newShipment = shipmentTemplate()
                state.shipments.push(newShipment)
                saveShipment(newShipment)
            },
            deleteShipment: (state, action: PayloadAction<Shipment>) => {
                const tag = action.payload.tag
                const pos = state.shipments.findIndex(shipment => shipment.id === action.payload.id)
                if (pos !== -1) state.shipments.splice(pos, 1)
                const opts = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(action.payload)
                }
                fetch("/api/shipments/delete",opts).then(()=>{dispatchToast({content: `Shipment ${tag} Deleted`})})
            },
            setShipment: (state, action: PayloadAction<Shipment>) => {
                state.shipment = processShipment(structuredClone(action.payload))
            },
            setActiveShipmentIndex: (state, action: PayloadAction<string>) => {
                state.activeShipmentIndex = state.activeShipmentIndex === action.payload ? null : action.payload
            },
            updateShipment: (state, action: PayloadAction<Shipment>) => {
                const pos = state.shipments.findIndex(shipment => shipment.id === action.payload.id)
                const newShipment = processShipment(structuredClone(action.payload))
                if (pos !== -1) state.shipments[pos] = newShipment
                if (state.shipment && state.shipment.id === action.payload.id) state.shipment = newShipment
                saveShipment(newShipment)
            },
            updateShipmentData: (state, action: PayloadAction<{ item: ShipmentItem, index: number }>) => {
                console.log("update shipment!", current(state.shipment))
                if (state.shipment) {
                    state.shipment.data[action.payload.index] = action.payload.item
                    console.log(current(state.shipment))
                    const newShipment = processShipment(structuredClone(current(state.shipment)))
                    state.shipment = newShipment
                    saveShipment(newShipment)
                }
            },
            addItemToShipmentData: (state, action: PayloadAction<ShipmentItem>) => {
                if (state.shipment) {
                    state.shipment.data.push(action.payload)
                    const newShipment = processShipment(structuredClone(current(state.shipment)))
                    state.shipment = newShipment
                    saveShipment(newShipment)
                }
            },
            deleteShipmentData: (state, action: PayloadAction<number>) => {
                if (!state.shipment) return

                state.shipment.data.splice(action.payload, 1)
                const pos = state.shipments.findIndex(shipment => shipment.id === state.shipment?.id)
                const newShipment = processShipment(structuredClone(current(state.shipment)))
                if (pos !== -1) state.shipments[pos] = newShipment
                saveShipment(newShipment)
            },
            setShippingCompanies: (state, action: PayloadAction<ShippingCompany[]>) => {
                state.shippingCompanies = action.payload
            },
            setItemKeys: (state, action: PayloadAction<Pick<ShipmentItem, "code" | "sku" | "desc">[]>) => {
                state.itemKeys = action.payload
            },
            deleteItemKey: (state, action: PayloadAction<Pick<ShipmentItem, "code" | "sku" | "desc">>) => {
                const pos = state.itemKeys.findIndex(item => item.code === action.payload.code && item.sku === action.payload.sku && item.desc === action.payload.desc)
                if (pos !== -1) {
                    state.itemKeys.splice(pos, 1)
                    let opts = {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(action.payload)
                    }
                    fetch('api/shipments/delete-shipping-item', opts).then(() => {
                        dispatchToast({content: `Item ${action.payload.code} Deleted`})
                    })
                }
            },
            setSkuKeys: (state, action: PayloadAction<string[]>) => {
                console.log(action.payload)
                state.skuKeys = action.payload
            }
        },
    })
;

function shipmentTemplate(): Shipment {
    return {
        atSea: false,
        bankCharges: 0,
        booked: false,
        confirmed: false,
        credit: 0,
        data: [],
        delivered: false,
        delivery: false,
        depReq: 0,
        due: "",
        duty: 0,
        dutyPound: 0,
        exchangeRate: 0,
        grandTotal: 0,
        id: Date.now(),
        intId: "",
        m3total: 0,
        outstanding: 0,
        overdue: false,
        ready: false,
        shipRef: "",
        shipping: 0,
        shippingCompany: "",
        subTotal: 0,
        tag: "",
        total: 0,
        totalCartons: 0,
        totalExVat: 0,
        totalPound: 0,
        vat: 0
    }
}

function itemTemplate():ShipmentItem {
    return {
        code: "",
        desc: "",
        billDesc: "",
        dollarTotal: 0,
        dutyPer: "",
        dutyValue: 0,
        fobDollar: "",
        fobPound: 0,
        height: "",
        hscode: "",
        length: "",
        m3perBox: 0,
        m3total: 0,
        numOfBoxes: 0,
        orderid: "",
        perOfOrder: 0,
        poundTotal: 0,
        qty: "",
        qtyPerBox: "",
        sku: "",
        supplier: "",
        totalPerItem: 0,
        width: ""
    }
}

function processShipment(shipment: Shipment) {
    shipment.subTotal = 0
    shipment.totalCartons = 0
    shipment.duty = 0
    shipment.m3total = 0
    for (let item of shipment.data) {
        item = {...itemTemplate(), ...item}
        item.dollarTotal = +item.qty * +item.fobDollar
        shipment.subTotal += item.dollarTotal

        if (+item.dutyPer !== 0 && item.dollarTotal !== 0) {
            item.dutyValue = item.dollarTotal / 100 * +item.dutyPer
            shipment.duty += item.dutyValue
        } else {
            item.dutyValue = 0
        }

        if(+item.fobDollar !== 0 && shipment.exchangeRate !== 0) {
            item.fobPound = +item.fobDollar / shipment.exchangeRate
            item.poundTotal = +item.qty * item.fobPound
        }

        if(+item.qty !== 0 && +item.qtyPerBox !== 0) {
            item.numOfBoxes = +item.qty / +item.qtyPerBox
            shipment.totalCartons += item.numOfBoxes
        }

        if(+item.length !== 0 && +item.width !== 0 && +item.height !== 0) {
            item.m3perBox = +item.length * +item.width * +item.height / 1000000
            item.m3total = item.numOfBoxes * item.m3perBox
            shipment.m3total += item.m3total
        }
    }
    //second pass for sum calculations

    if(shipment.exchangeRate !== 0 && shipment.duty !== 0) {
        shipment.total = shipment.subTotal - shipment.credit
        if(shipment.total !== 0) {
            shipment.totalPound = shipment.total / shipment.exchangeRate
            shipment.depReq = shipment.total / 100 * 30
            shipment.outstanding = shipment.subTotal - shipment.depReq
            shipment.dutyPound = shipment.duty / shipment.exchangeRate
            shipment.totalExVat = shipment.totalPound + shipment.shipping + shipment.dutyPound + shipment.bankCharges
            shipment.vat = shipment.totalExVat * 0.2
            shipment.grandTotal = shipment.totalExVat + shipment.vat
        }
    }

    for (let item of shipment.data) {
        if(item.dollarTotal === 0){
            item.perOfOrder = 0
            item.totalPerItem = 0
            continue
        }
        item.perOfOrder = item.dollarTotal / shipment.subTotal * 100
        item.totalPerItem = shipment.totalExVat / 100 * item.perOfOrder / +item.qty
    }

    return shipment
}

function saveShipment(shipment:Shipment) {
    const opts = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipment)
    }
    fetch("/api/shipments/update", opts).then(() => {
        dispatchToast({content: `Shipment ${shipment.tag} Updated`})
    })
}

export const {
    setShipments, createShipment, deleteShipment, updateShipment, setShipment, setActiveShipmentIndex, addItemToShipmentData,
    updateShipmentData, deleteShipmentData, setShippingCompanies, setItemKeys, deleteItemKey, setSkuKeys
} = shipmentsSlice.actions

export const selectShipments = (state: shipmentWrapper) => state.shipments.shipments
export const selectLastShipment = (state: shipmentWrapper) => state.shipments.shipments[state.shipments.shipments.length - 1]
export const selectShipment = (state: shipmentWrapper) => state.shipments.shipment
export const selectActiveShipmentIndex = (state: shipmentWrapper) => state.shipments.activeShipmentIndex
export const selectShippingCompanies = (state: shipmentWrapper) => state.shipments.shippingCompanies
export const selectItemKeys = (state: shipmentWrapper) => state.shipments.itemKeys
export const selectSkuKeys = (state: shipmentWrapper) => state.shipments.skuKeys

export default shipmentsSlice.reducer;