import '../styles/global.css'
import type {AppProps} from "next/app"
import {appWrapper} from "../store/store";
import Menu from "../components/menu/menu";
import {useRouter} from 'next/router'
import {SessionProvider} from "next-auth/react";
import Theme from './theme'

function App({Component, pageProps:{session, ...pageProps}}: AppProps) {
    const router = useRouter()
    return (
            <SessionProvider session={session}>
                <Theme {...pageProps}/>
                {router.pathname !== "/login" ? <Menu/> : null}
                <Component {...pageProps}></Component>
            </SessionProvider>
    )
}

export default appWrapper.withRedux(App)