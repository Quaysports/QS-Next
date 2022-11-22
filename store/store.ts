import {combineReducers, configureStore, PreloadedState} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {stockReportsSlice} from "./stock-reports-slice";
import {shopOrdersSlice} from "./shop-orders-slice";
import {userSlice} from "./dashboard/user-slice";
import {quickLinksSlice} from "./shop-tills/quicklinks-slice";
import {itemDatabaseSlice} from "./item-database/item-database-slice";
import {forecastSlice} from "./stock-forecast-slice";
import {marginCalculatorSlice} from "./margin-calculator-slice";


const rootReducer = combineReducers({
    [shopOrdersSlice.name]: shopOrdersSlice.reducer,
    [stockReportsSlice.name]: stockReportsSlice.reducer,
    [userSlice.name]:userSlice.reducer,
    [quickLinksSlice.name]: quickLinksSlice.reducer,
    [itemDatabaseSlice.name]: itemDatabaseSlice.reducer,
    [forecastSlice.name]:forecastSlice.reducer,
    [marginCalculatorSlice.name]: marginCalculatorSlice.reducer
})

export function setupStore(preloadedState?: PreloadedState<RootState>){
    return configureStore({
        reducer: rootReducer,
        devTools:true,
        preloadedState
    });
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export const appWrapper = createWrapper(()=>setupStore());