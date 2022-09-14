import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface IncorrectStockItem {
    BRAND: string
    TITLE: string
    SKU: string
    CHECKED: boolean
    QTY: number
    PRIORITY: boolean
}

export interface IncorrectStockState {
    incorrectStockReport: {[key:string]:IncorrectStockItem[]};
    zeroStockReport: {[key:string]:IncorrectStockItem[]};
    validData: boolean;
    IncorrectStockReportMenuOptions: {[key:string]:string};
}

export interface IncorrectStockWrapper {
    [key: string]: IncorrectStockState
}

const initialState: IncorrectStockState = {
    incorrectStockReport: {},
    zeroStockReport: {},
    validData: true,
    IncorrectStockReportMenuOptions: null,
};

export const incorrectStockSlice = createSlice({
        name: "incorrectStock",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.incorrectStock,
                };
            },
        },
        reducers:{
            setIncorrectStockInitialState: (state, action) => {state.incorrectStockReport = action.payload},
            setIncorrectStockChecked: (state, action) => {state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload},
            setIncorrectStockSplice: (state, action) => {state.incorrectStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)},
            setIncorrectStockQty:(state, action) => {state.incorrectStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload},

            setZeroStockInitialState: (state, action) => {state.zeroStockReport = action.payload},
            setZeroStockChecked: (state, action) => {state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload},
            setZeroStockSplice: (state, action) => {state.zeroStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)},
            setZeroStockQty:(state, action) => {state.zeroStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload},

            setValidData: (state, action) => {state.validData = action.payload;},

        },
    })
;

export const {setIncorrectStockInitialState} = incorrectStockSlice.actions;
export const {setZeroStockInitialState} = incorrectStockSlice.actions
export const {setIncorrectStockQty} = incorrectStockSlice.actions;
export const {setZeroStockQty} = incorrectStockSlice.actions;
export const {setValidData} = incorrectStockSlice.actions;
export const {setIncorrectStockChecked} = incorrectStockSlice.actions
export const {setZeroStockChecked} = incorrectStockSlice.actions
export const {setZeroStockSplice} = incorrectStockSlice.actions
export const {setIncorrectStockSplice} = incorrectStockSlice.actions

export const selectIncorrectStockState = (state:IncorrectStockWrapper) => state.incorrectStock.incorrectStockReport
export const selectZeroStockState = (state: IncorrectStockWrapper) => state.incorrectStock.zeroStockReport
export const selectValidData = (state: IncorrectStockWrapper) => state.incorrectStock.validData

export default incorrectStockSlice.reducer;