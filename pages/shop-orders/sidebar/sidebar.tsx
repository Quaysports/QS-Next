import * as React from "react";
import styles from "../shop-orders.module.css"
import {useSelector} from "react-redux";
import {selectSideBarContent} from "../../../store/shop-orders-slice";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/SidebarButton";
import {useEffect} from "react";
import {useRouter} from "next/router";

/**
 * Side Bar Component
 */
export default function SideBar() {

    const sideBarContent = useSelector(selectSideBarContent)
    const router = useRouter()

    useEffect(() => {})

    function buildSideBar(){
        let elementArray = []
        for(const i in sideBarContent.content){
            elementArray.push(
                <SidebarButton className={`${styles["sidebar-rows"]} ${"button"}`} key={i} onClick={()=>router.push({query:{...router.query, index:i}})}>
                    {Object.keys(sideBarContent.content[i])}({Object.values(sideBarContent.content[i])})
                </SidebarButton>
            )
        }
        return elementArray
    }

    return (
        <SidebarLayout>
            <div key={1} id={styles["sidebar-title"]}>{sideBarContent.title}</div>
            {buildSideBar()}
        </SidebarLayout>
    )
};