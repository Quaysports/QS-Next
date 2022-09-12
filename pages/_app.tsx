import '../styles/global.css'
import type {AppProps} from "next/app"
import {appWrapper} from "../store/store";
import Menu from "./menu";
import {useRouter} from 'next/router'

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()
    return (
        <div>
            {router.pathname !== "/login" ? <Menu/> : null}
            <Component {...pageProps}/>
        </div>
    )
}

export default appWrapper.withRedux(MyApp)