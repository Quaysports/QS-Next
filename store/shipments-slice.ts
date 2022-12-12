import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {Shipment} from "../server-modules/shipping/shipping";

export interface shipmentWrapper {
    shipments: shipmentState
}

export interface shipmentState {
    shipments: Shipment[]
}

const initialState:shipmentState = {
    shipments:[]
}

export const shipmentsSlice = createSlice({
        name: "shipments",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.shipments
                }
            },
        },
        reducers:{
            setShipments:(state,action:PayloadAction<Shipment[]>) => {
                console.log("setting slice!")
                state.shipments = action.payload
            },
        },
    })
;

export const {setShipments} = shipmentsSlice.actions

export const selectShipments = (state:shipmentWrapper) => state.shipments.shipments

export default shipmentsSlice.reducer;