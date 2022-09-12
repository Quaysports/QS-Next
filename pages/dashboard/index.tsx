import React, {useState, useEffect} from 'react';
import {appWrapper} from "../../store/store";
import {data} from "./MOCK-PERMISSIONS"
import {setDashboardMenuOptions} from "../../store/dashboard-slice";
import {useDispatch} from "react-redux";
import {setMenuOptions} from "../../store/menu-slice";



export default function Dashboard(props) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setMenuOptions(props.menuOpt))
    },[])

    return (
        <div>
            <div>

            </div>
        </div>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async (context) =>{
            //TODO insert fetch request here for getting user permissions and set them to the props
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

            /*let objectKeysArray = Object.keys(props.permissions)
            objectKeysArray.map((key, index) => {
                if (props.permissions[key]) {
                    switch (key) {
                        case "users":
                            return <span key={index}><Link to="users">Users</Link></span>
                        case "orderSearch":
                            return <span key={index}><Link to="order-search">Order Search</Link></span>
                        case "priceUpdates":
                            return <span key={index}><Link to="price-updates">Price Updates</Link></span>
                        case "shop":
                            return <span key={index}><Link to="shop">Shop</Link></span>
                        case "online":
                            return <span key={index}><Link to="online">Online</Link></span>
                        case "rotas":
                            return <span key={index}><Link to="rotas">Rotas</Link></span>
                        case "holidays":
                            return <span key={index}><Link to="holidays">Holidays</Link></span>
                        case "baitOrdering":
                            return <span key={index}><Link to="bait-orders">Bait Orders</Link></span>
                    }
                }
                return null
            })*/
        return {
            props: {menuOpt: menuObject}
        }
})
