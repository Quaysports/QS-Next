import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface confirmState {
    show: boolean
}

export interface confirmWrapper {
    confirm: confirmState
}

const initialState:confirmState = {
    show:false
}

export const confirmSlice = createSlice({
        name: "confirm",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.confirm,
                };
            },
        },
        reducers:{
            setShowConfirm: (state, action) => {state.show = action.payload},
            setConfirmValue: (state, action) => {state.show = action.payload},
        },
    })
;

export const {setShowConfirm} = confirmSlice.actions

export const selectShowConfirm = (state:confirmWrapper) => state.confirm.show

export default confirmSlice.reducer;