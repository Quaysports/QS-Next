import {appWrapper} from "../../store/store";
import {setMenuOptions} from "../../store/menu-slice";
import {getSession} from "next-auth/react";

export default function Dashboard() {
    return (
        <div>
            <div>

            </div>
        </div>
    )
}

//Builds an object for the top menu where the key is the UI display and the value is folder location
function setupMenu(data) {
    let permissionsData = data
    let menuObject = {}
    Object.keys(permissionsData).map((permission) => {
        if (permissionsData[permission].auth) {
            switch (permission) {
                case "users":
                    menuObject["Users"] = "users";
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
        role?: string,
        rota?: string
    }
    expires: string
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async (context) => {
            const session = await getSession(context) as sessionObject
            //TODO insert fetch request here for getting user permissions and set them to the props
            store.dispatch(setMenuOptions(setupMenu(session.user.permissions)))
        return void{}

})