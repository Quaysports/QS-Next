import { configureStore} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {stockReportsSlice} from "./stock-reports-slice";
import {shopOrdersSlice} from "./shop-orders-slice";
import {userSlice} from "./dashboard/user-slice";
import {quickLinksSlice} from "./shop-tills/quicklinks-slice";
import {itemDatabaseSlice} from "./item-database/item-database-slice";

export const myStore = () =>
    configureStore({
        reducer: {
            [shopOrdersSlice.name]: shopOrdersSlice.reducer,
            [stockReportsSlice.name]: stockReportsSlice.reducer,
            [userSlice.name]:userSlice.reducer,
            [quickLinksSlice.name]: quickLinksSlice.reducer,
            [itemDatabaseSlice.name]: itemDatabaseSlice.reducer
        },
        devTools: true,
    });

export const appWrapper = createWrapper(myStore);