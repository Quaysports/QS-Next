import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface Permissions {
    users: boolean,
    orderSearch: boolean,
    priceUpdates: boolean,
    shop: boolean,
    online: boolean,
    rotas: boolean,
    newRota: boolean,
    holidays: boolean,
    baitOrdering: boolean
}

interface DashboardState {
    permissions: Permissions
}

export interface DashboardWrapper {
    [key: string]: DashboardState
}

const initialState: DashboardState = {
    permissions: {
        users: false,
        orderSearch: false,
        priceUpdates: false,
        shop: false,
        online: false,
        rotas: false,
        newRota: false,
        holidays: false,
        baitOrdering: false
    }
};

export const dashboardSlice = createSlice({
        name: "dashboard",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                };
            },
        },
        reducers:{
            setPermissions: (state, action) => {state.permissions = action.payload},
        },
    })
;

export const {setPermissions} = dashboardSlice.actions

export const selectPermissions = (state: DashboardWrapper) => state.dashboard.permissions

export default dashboardSlice.reducer;