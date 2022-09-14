import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface popupState {
    show: boolean
}

export interface popupWrapper {
    popup: popupState
}

const initialState:popupState = {
    show:false
}

export const popupSlice = createSlice({
        name: "popup",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.popup,
                };
            },
        },
        reducers:{
            setShowPopup: (state, action) => {state.show = action.payload},
        },
    })
;

export const {setShowPopup} = popupSlice.actions

export const selectShowPopup = (state:popupWrapper) => state.popup.show

export default popupSlice.reducer;