import { configureStore} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {incorrectStockSlice} from "./incorrect-stock-slice";
import {dashboardSlice} from "./dashboard-slice";
import {menuSlice} from "./menu-slice";
import {shopOrdersSlice} from "./shop-orders-slice";
import {userSlice} from "./dashboard/user-slice";
import {searchBarSlice} from "./components/search-bar-slice";

const myStore = () =>
    configureStore({
        reducer: {
            [shopOrdersSlice.name]: shopOrdersSlice.reducer,
            [incorrectStockSlice.name]: incorrectStockSlice.reducer,
            [dashboardSlice.name]: dashboardSlice.reducer,
            [menuSlice.name]: menuSlice.reducer,
            [userSlice.name]:userSlice.reducer,
            [searchBarSlice.name]: searchBarSlice.reducer
        },
        devTools: true,
    });

export const appWrapper = createWrapper(myStore);