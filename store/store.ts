import { configureStore} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {incorrectStockSlice} from "./incorrect-stock-slice";
import {dashboardSlice} from "./dashboard-slice";
import {menuSlice} from "./menu-slice";

const myStore = () =>
    configureStore({
        reducer: {
            [incorrectStockSlice.name]: incorrectStockSlice.reducer,
            [dashboardSlice.name]: dashboardSlice.reducer,
            [menuSlice.name]: menuSlice.reducer
        },
        devTools: true,
    });

export const appWrapper = createWrapper(myStore);