import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import {combineReducers, configureStore} from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { AppStore, RootState } from '../store/store'
import stockReportReducer, {stockReportsSlice} from '../store/reports/stock-reports-slice'
import shopOrdersReducer, {shopOrdersSlice} from "../store/shop-orders-slice";
import userReducer, {usersSlice} from "../store/dashboard/users-slice";
import quickLinksReducer, {quickLinksSlice} from "../store/shop-tills/quicklinks-slice";
import itemDatabaseReducer, {itemDatabaseSlice} from "../store/item-database/item-database-slice";
import NotificationWrapper from "../components/notification/notification-wrapper";
import {createWrapper} from "next-redux-wrapper";
import {forecastSlice} from "../store/stock-forecast-slice";
import {marginCalculatorSlice} from "../store/margin-calculator-slice";
import {sessionSlice} from "../store/session-slice";
import {shipmentsSlice} from "../store/shipments-slice";
import {holidaysSlice} from "../store/dashboard/holiday-slice";
import {rotaSlice} from "../store/dashboard/rotas-slice";
import {pickListSlice} from "../store/shop-tills/pick-list-slice";
import {salesSlice} from "../store/reports/sales-slice";

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
}

const rootReducer = combineReducers({
    shopOrders: shopOrdersReducer,
    stockReports: stockReportReducer,
    users:userReducer,
    quickLinks: quickLinksReducer,
    itemDatabase: itemDatabaseReducer
})

const mockStore = configureStore({ reducer: rootReducer })
export const appWrapper = createWrapper(()=>mockStore);


function renderWithProviders(
    ui: React.ReactElement,
    {
        // @ts-ignore
        store = mockStore,
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {


    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        const {store} = appWrapper.useWrappedStore(ui)
        return <Provider store={store}><NotificationWrapper />{children}</Provider> as JSX.Element
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions })}
}
export * from '@testing-library/react'
export {renderWithProviders as render}