import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface stockForecastWrapper {
    stockForecast: stockForecastState
}

export interface stockForecastState {
    show:boolean;
    domestic:boolean;
    list:boolean;
}

const initialState:stockForecastState = {
    show:false,
    domestic:false,
    list:false,
}

export const stockForecastSlice = createSlice({
        name: "stockForecast",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.stockForecast
                }
            },
        },
        reducers:{
            setShowToggle:(state,action) => {state.show = action.payload},
            setDomesticToggle:(state,action) => {state.domestic = action.payload},
            setListToggle:(state,action) => {state.list = action.payload},
        },
    })
;

export const {setShowToggle, setDomesticToggle, setListToggle} = stockForecastSlice.actions

export const selectShowToggle = (state:stockForecastWrapper) => state.stockForecast.show
export const selectDomesticToggle = (state:stockForecastWrapper) => state.stockForecast.domestic
export const selectListToggle = (state:stockForecastWrapper) => state.stockForecast.list

export default stockForecastSlice.reducer;