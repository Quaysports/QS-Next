import '../styles/global.css'
import type {AppProps} from "next/app"
import {appWrapper} from "../store/store";
import {SessionProvider} from "next-auth/react";
import UserSetup from './user-setup'
import NotificationWrapper from "../components/notification/notification-wrapper";
import {Provider} from "react-redux";
import ActivityTracker from "../components/activity-tracker";
import ToastWrapper from "../components/toast/toast-wrapper";

export default function App({Component, pageProps:{session, ...pageProps}}: AppProps) {
    const {store, props} = appWrapper.useWrappedStore(pageProps);

    return (
        <Provider store={store}>
            <SessionProvider session={session}>
                <UserSetup>
                    <NotificationWrapper />
                    <ToastWrapper />
                    <ActivityTracker />
                    <Component {...props}></Component>
                </UserSetup>
            </SessionProvider>
        </Provider>
    )
}