import { configureStore} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {incorrectStockSlice} from "./incorrect-stock-slice";
import {dashboardSlice} from "./dashboard-slice";
import {shopOrdersSlice} from "./shop-orders-slice";
import {userSlice} from "./dashboard/user-slice";
import {stockForecastSlice} from "./stock-forecast-slice";
import {quickLinksSlice} from "./shop-tills/quicklinks";

const myStore = () =>
    configureStore({
        reducer: {
            [shopOrdersSlice.name]: shopOrdersSlice.reducer,
            [incorrectStockSlice.name]: incorrectStockSlice.reducer,
            [dashboardSlice.name]: dashboardSlice.reducer,
            [userSlice.name]:userSlice.reducer,
            [stockForecastSlice.name]: stockForecastSlice.reducer,
            [quickLinksSlice.name]: quickLinksSlice.reducer,
        },
        devTools: true,
    });

export const appWrapper = createWrapper(myStore);