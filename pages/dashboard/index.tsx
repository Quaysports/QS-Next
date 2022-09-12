import React, {useState, useEffect} from 'react';
import {appWrapper} from "../../store/store";
import {data} from "./MOCK-PERMISSIONS"
import {useDispatch} from "react-redux";
import {setMenuOptions} from "../../store/menu-slice";

export default function Dashboard(props) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setMenuOptions(props.menuOptions))
    },[])

    return (
        <div>
            <div>

            </div>
        </div>
    )
}

//Builds an object for the top menu where the key is the UI display and the value is folder location
function setupMenu(data){
    let permissionsData = data
    let menuObject = {}
    Object.keys(permissionsData).map((permission) => {
        if (permissionsData[permission].auth) {
            switch (permission) {
                case "users":
                    menuObject["Users"] = "users"; break;
                case "orderSearch":
                    menuObject["Order Search"] = "order-search"; break;
                case "priceUpdates":
                    menuObject["Price Updates"] = "price-updates"; break;
                case "shop":
                    menuObject["Shop"] = "shop"; break;
                case "online":
                    menuObject["Online"] = "online"; break;
                case "rotas":
                    menuObject["Rotas"] = "rotas"; break;
                case "holidays":
                    menuObject["Holidays"] = "holidays"; break;
            }
        }
    })
    return menuObject
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async (context) =>{
            //TODO insert fetch request here for getting user permissions and set them to the props
            const menuObject = setupMenu(data)
        return {
            props: {menuOptions: menuObject}
        }
})
