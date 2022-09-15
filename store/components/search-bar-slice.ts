import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface SearchBarState {
    searchableArray: { SKU: string, TITLE: string, EAN?: string }[]
    EAN: boolean
}

export interface SearchBarWrapper {
    searchBar: SearchBarState
}

const initialState:SearchBarState = {
    searchableArray: [],
    EAN: false,
}

export const searchBarSlice = createSlice({
        name: "searchBar",
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
            setSearchableArray: (state, action) => {state.searchableArray = action.payload},
            setEAN: (state, action) => {state.EAN = action.payload}
        },
    });

export const {setSearchableArray, setEAN} = searchBarSlice.actions

export const selectSearchableArray = (state:SearchBarWrapper) => state.searchBar.searchableArray
export const selectEAN = (state:SearchBarWrapper) => state.searchBar.EAN

export default searchBarSlice.reducer;