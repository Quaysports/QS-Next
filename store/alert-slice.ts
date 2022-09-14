import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface alertState {
    show: boolean
}

export interface alertWrapper {
    alert: alertState
}

const initialState:alertState = {
    show:false
}

export const alertSlice = createSlice({
        name: "alert",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.alert,
                };
            },
        },
        reducers:{
            setShowAlert: (state, action) => {state.show = action.payload},
        },
    })
;

export const {setShowAlert} = alertSlice.actions

export const selectShowAlert = (state:alertWrapper) => state.alert.show

export default alertSlice.reducer;