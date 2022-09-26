import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface quickLinks{
    id:string;
    links:{
        SKU:string;
        SHOPPRICEINCVAT:number;
        TITLE:string;
    }[]
}

export interface quickLinksWrapper {
    quickLinks: quickLinksState
}

export interface quickLinksState {
    quickLinksArray: quickLinks[]
}

const initialState:quickLinksState = {
    quickLinksArray:[]
}

export const quickLinksSlice = createSlice({
        name: "quickLinks",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.quickLinks
                }
            },
        },
        reducers:{
            updateQuickLinks:(state,action) => {state.quickLinksArray = action.payload},
            updateQuickLinkID:(state,action) => {state.quickLinksArray[action.payload.id].id = action.payload.data},
            deleteQuickLink:(state,action)=> {state.quickLinksArray.splice(action.payload,1)}
        },
    })
;

export const {updateQuickLinks, updateQuickLinkID, deleteQuickLink} = quickLinksSlice.actions

export const selectQuickLinks = (state:quickLinksWrapper) => state.quickLinks.quickLinksArray

export default quickLinksSlice.reducer;