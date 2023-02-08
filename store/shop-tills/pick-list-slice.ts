import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {PickListItems} from "../../server-modules/shop/shop";

export interface pickListWrapper {
    pickList: pickListState
}

export interface pickListState {
    items: PickListItems[]
}

const initialState: pickListState = {
    items: []
}

export const pickListSlice = createSlice({
        name: "pickList",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.pickList
                }
            },
        },
        reducers: {
            updatePickList: (state, action: PayloadAction<PickListItems[]>) => {
                state.items = action.payload
            }
        },
    })
;

export const {
    updatePickList,
} = pickListSlice.actions

export const selectPickList = (state: pickListWrapper) => state.pickList.items

export default pickListSlice.reducer;