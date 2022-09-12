import '../styles/global.css'
import type {AppProps} from "next/app"
import {appWrapper} from "../store/store";
import Menu from "./menu";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <div>
          <Menu/>
          <Component {...pageProps}/>
      </div>
  )
}

export default appWrapper.withRedux(MyApp)