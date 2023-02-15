import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DashboardSettings, MarginSettings, Settings, User, UserTheme} from "../server-modules/users/user";
import {dispatchToast} from "../components/toast/dispatch-toast";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "./store";

export const hydrate = createAction<RootState>(HYDRATE);


export interface sessionWrapper {
    session: sessionState
}

export interface sessionState {
    user: User
}

const initialState: sessionState = {
    user: {
        _id: "",
        colour: "",
        holiday: [],
        password: "",
        pin: "",
        rota: "",
        sick: {paid: [], unpaid: []},
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
                displayTitles: false,
                displayRetail: true,
                displayPackaging: true,
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
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.session
                    };
                })
                .addDefaultCase(() => {
                })
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
                fetch('/api/user/update-user', opt).then(
                    () => dispatchToast({content: "User updated"})
                )
            },
            updateSettings: (state, action: PayloadAction<Settings>) => {
                state.user.settings = {...state.user.settings, ...action.payload}
            },
            updateTheme: (state, action: PayloadAction<UserTheme>) => {
                state.user.theme = action.payload
            },
            updateMarginSetting: (state, action: PayloadAction<MarginSettings>) => {
                if (!state.user) return
                state.user.settings.marginCalculator = action.payload
                let update = {
                    username: state.user.username,
                    settings: {...state.user.settings, marginCalculator: action.payload}
                }
                const opt = {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(update)
                }
                fetch('/api/user/update-user', opt).then(
                    () => dispatchToast({content: "User margin settings updated"})
                )
            },
            updateDashboardSetting: (state, action: PayloadAction<DashboardSettings>) => {
                if (!state.user) return
                state.user.settings.dashboard = action.payload
                let update = {username: state.user.username, settings: {...state.user.settings, dashboard: action.payload}}
                const opt = {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(update)
                }
                fetch('/api/user/update-user', opt).then(
                    () => dispatchToast({content: "User dashboard settings updated"})
                )
            }
        },
    })
;

export const {setUserData, updateSettings, updateMarginSetting, updateDashboardSetting} = sessionSlice.actions

export const selectUser = (state: sessionWrapper) => state.session.user;
export const selectMarginSettings = (state: sessionWrapper) => state.session.user.settings.marginCalculator
export const selectDashboardSettings = (state: sessionWrapper) => state.session.user.settings.dashboard

export default sessionSlice.reducer;