import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {PickListItem} from "../../server-modules/shop/shop";

export interface pickListWrapper {
    pickList: pickListState
}

export interface pickListState {
    items: PickListItem[]
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
            updatePickList: (state, action: PayloadAction<PickListItem[]>) => {
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