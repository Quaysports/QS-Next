import {appWrapper} from "../../store/store";
import {setMenuOptions} from "../../store/menu-slice";
import {getSession} from "next-auth/react";
import {useRouter} from "next/router";
import UserLandingPage from "./user";
import HomeLandingPage from "./home";

export default function Dashboard() {
    const router = useRouter()

    return(
        <div>
            {router.query.tab === undefined || router.query.tab === "home" ?  <HomeLandingPage/>: null}
            {router.query.tab === "user" ?  <UserLandingPage />: null}
        </div>
    );
}

//Builds an object for the top menu where the key is the UI display and the value is folder location
function setupMenu(data) {
    let permissionsData = data
    let menuObject = {}
    Object.keys(permissionsData).map((permission) => {
        if (permissionsData[permission].auth) {
            menuObject["Home"] = "dashboard?tab=home";
            switch (permission) {
                case "users":
                    menuObject["Users"] = "dashboard?tab=user";
                    break;
                case "orderSearch":
                    menuObject["Order Search"] = "order-search";
                    break;
                case "priceUpdates":
                    menuObject["Price Updates"] = "price-updates";
                    break;
                case "shop":
                    menuObject["Shop"] = "shop";
                    break;
                case "online":
                    menuObject["Online"] = "online";
                    break;
                case "rotas":
                    menuObject["Rotas"] = "rotas";
                    break;
                case "holidays":
                    menuObject["Holidays"] = "holidays";
                    break;
            }
        }
    })
    return menuObject
}

interface sessionObject {
    user: {
        name?: string;
        email?: string;
        image?: string;
        username?: string
        permissions?: { [key: string]: { auth: boolean, label: string } }
        theme?:{[key:string]:string}
        role?: string,
        rota?: string
    }
    expires: string
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async (context) => {
            const session = await getSession(context) as sessionObject

            if(!session){
                return {
                    redirect: {
                        destination: '/login',
                        permanent: false,
                    }
                }
            } else {
                store.dispatch(setMenuOptions(setupMenu(session.user.permissions)))
                return void {}
            }
})