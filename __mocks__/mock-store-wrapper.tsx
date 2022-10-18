import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import {combineReducers, configureStore} from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { AppStore, RootState } from '../store/store'
import stockReportReducer from '../store/stock-reports-slice'
import shopOrdersReducer from "../store/shop-orders-slice";
import userReducer from "../store/dashboard/user-slice";
import quickLinksReducer from "../store/shop-tills/quicklinks-slice";
import itemDatabaseReducer from "../store/item-database/item-database-slice";
import NotificationWrapper from "../components/notification/notification-wrapper";
import {createWrapper} from "next-redux-wrapper";

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