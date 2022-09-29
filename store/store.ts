import { configureStore} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {stockReportsSlice} from "./stock-reports-slice";
import {dashboardSlice} from "./dashboard-slice";
import {shopOrdersSlice} from "./shop-orders-slice";
import {userSlice} from "./dashboard/user-slice";
import {stockForecastSlice} from "./stock-forecast-slice";
import {quickLinksSlice} from "./shop-tills/quicklinks-slice";
import {itemDatabaseSlice} from "./item-database/item-database-slice";

const myStore = () =>
    configureStore({
        reducer: {
            [shopOrdersSlice.name]: shopOrdersSlice.reducer,
            [stockReportsSlice.name]: stockReportsSlice.reducer,
            [dashboardSlice.name]: dashboardSlice.reducer,
            [userSlice.name]:userSlice.reducer,
            [stockForecastSlice.name]: stockForecastSlice.reducer,
            [quickLinksSlice.name]: quickLinksSlice.reducer,
            [itemDatabaseSlice.name]: itemDatabaseSlice.reducer
        },
        devTools: true,
    });

export const appWrapper = createWrapper(myStore);