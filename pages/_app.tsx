import '../styles/global.css'
import type {AppProps} from "next/app"
import {appWrapper} from "../store/store";
import Menu from "./menu";
import {useRouter} from 'next/router'
import {SessionProvider} from "next-auth/react";

function App({Component, pageProps:{session, ...pageProps}}: AppProps) {
    const router = useRouter()
    return (
            <SessionProvider session={session}>
                {router.pathname !== "/login" ? <Menu/> : null}
                <Component {...pageProps}/>
            </SessionProvider>
    )
}

export default appWrapper.withRedux(App)