import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {MarginSettings, Settings, User} from "../server-modules/users/user";

export interface sessionWrapper {
    session: sessionState
}

export interface sessionState {
    user: User
}

const initialState: sessionState = {
    user: {
        username: "",
        role: "",
        permissions: {},
        theme: {},
        settings: {
            marginCalculator: {
                tables: {
                    InfoTable: true,
                    PricesTable: true,
                    StatsTable: true,
                    CostsTable: true,
                    EbayTable: true,
                    AmazonTable: true,
                    MagentoTable: true,
                    ShopTable: true,
                    MiscTable: true,
                },
                displayTitles: false
            }
        }
    }
}

export const sessionSlice = createSlice({
        name: "session",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.session,
                };
            },
        },
        reducers: {
            setUserData: (state, action: PayloadAction<User>) => {
                state.user = {...state.user, ...action.payload}
            },
            updateUserData: (state, action: PayloadAction<User>) => {
                state.user = action.payload
                const opt = {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(state.user)
                }
                fetch('/api/user/update-user', opt).then(res => console.log(res))
            },
            updateSettings: (state, action: PayloadAction<Settings>) => {
                state.user.settings = action.payload
            },
            updateMarginSetting: (state, action: PayloadAction<MarginSettings>) => {
                if (!state.user) return
                state.user.settings.marginCalculator = action.payload
                const opt = {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(state.user)
                }
                fetch('/api/user/update-user', opt).then(res => console.log(res))
            },
        },
    })
;

export const {setUserData, updateUserData, updateSettings, updateMarginSetting} = sessionSlice.actions

export const selectUser = (state: sessionWrapper) => state.session.user;
export const selectMarginSettings = (state: sessionWrapper) => state.session.user.settings.marginCalculator

export default sessionSlice.reducer;