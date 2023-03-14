import {createAction, createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "./store";

export const hydrate = createAction<RootState>(HYDRATE);

export interface shipmentState {}

const initialState: shipmentState = {}

export const resetStore = createSlice({
        name: "RESET_STORE",
        initialState,
        reducers: {
            reset: () => {

            }
        },
    })
;

export const {reset} = resetStore.actions

export default resetStore.reducer;