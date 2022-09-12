import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface MenuState {
    menuOptions: {[key:string]:string};
}

export interface MenuWrapper {
    [key: string]: MenuState
}

const initialState: MenuState = {
    menuOptions: {}
};

export const menuSlice = createSlice({
        name: "menu",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.menu,
                };
            },
        },
        reducers:{
            setMenuOptions: (state, action) => {state.menuOptions = action.payload},
        },
    })
;

export const {setMenuOptions} = menuSlice.actions

export const selectMenuOptions = (state: MenuWrapper) => state.menu.menuOptions

export default menuSlice.reducer;