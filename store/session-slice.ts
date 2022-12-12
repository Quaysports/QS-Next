import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {DashboardSettings, MarginSettings, Settings, User, UserTheme} from "../server-modules/users/user";

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
            },
            dashboard: {
                holiday: {
                    location: "shop"
                }
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
            updateTheme: (state, action: PayloadAction<UserTheme>) => {
                state.user.theme = action.payload
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
            updateDashboardSetting: (state, action: PayloadAction<DashboardSettings>) => {
                if (!state.user) return
                state.user.settings.dashboard = action.payload
                const opt = {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(state.user)
                }
                fetch('/api/user/update-user', opt).then(res => console.log(res))
            }
        },
    })
;

export const {setUserData, updateUserData, updateSettings, updateTheme, updateMarginSetting, updateDashboardSetting} = sessionSlice.actions

export const selectUser = (state: sessionWrapper) => state.session.user;
export const selectMarginSettings = (state: sessionWrapper) => state.session.user.settings.marginCalculator
export const selectDashboardSettings = (state: sessionWrapper) => state.session.user.settings.dashboard

export default sessionSlice.reducer;