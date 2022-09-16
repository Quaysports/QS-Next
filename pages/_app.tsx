import '../styles/global.css'
import type {AppProps} from "next/app"
import {appWrapper} from "../store/store";
import {SessionProvider} from "next-auth/react";
import UserSetup from './user-setup'
import NotificationWrapper from "../components/notification/notification-wrapper";

function App({Component, pageProps:{session, ...pageProps}}: AppProps) {
    return (
            <SessionProvider session={session}>
                <UserSetup {...pageProps}/>
                <NotificationWrapper />
                <Component {...pageProps}></Component>
            </SessionProvider>
    )
}

export default appWrapper.withRedux(App)