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

    useEffect(() => {
    })

    function buildSideBar() {
        let elementArray = []
        for (const i in sideBarContent.content) {
            let sideBarText = `${Object.keys(sideBarContent.content[i])}(${Object.values(sideBarContent.content[i])})`
            elementArray.push(
                <SidebarButton className={`${styles["sidebar-rows"]} ${"button"}`} key={"sidebar" + i}
                               onClick={() => router.push({query: {...router.query, index: i, brand: "All Items"}})}>
                    {sideBarText}
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