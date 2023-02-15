import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {Shipment} from "../server-modules/shipping/shipping";
import {RootState} from "./store";

export const hydrate = createAction<RootState>(HYDRATE);

export interface shipmentWrapper {
    shipments: shipmentState
}

export interface shipmentState {
    shipments: Shipment[]
}

const initialState: shipmentState = {
    shipments: []
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
        },
    })
;

export const {setShipments} = shipmentsSlice.actions

export const selectShipments = (state: shipmentWrapper) => state.shipments.shipments

export default shipmentsSlice.reducer;