import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import {configureStore} from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { AppStore, RootState } from '../store/store'
import NotificationWrapper from "../components/notification/notification-wrapper";
import {createWrapper} from "next-redux-wrapper";
import {rootReducer} from "../store/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
}

export const mockStore = configureStore({ reducer: rootReducer })
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
export {renderWithProviders}