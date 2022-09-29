import * as React from "react";
import styles from "../shop-orders.module.css"
import {useSelector} from "react-redux";
import {selectSideBarContent} from "../../../store/shop-orders-slice";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/SidebarButton";

interface SideBarProps {
    supplierFilter : (x:string) => void
}
export default function SideBar(props:SideBarProps) {

    const sideBarContent = useSelector(selectSideBarContent)

    function buildSideBar(){
        let elementArray = []
        let i = 0
        for(const key of Object.keys(sideBarContent.content)){
            elementArray.push(
                <SidebarButton className={`${styles["sidebar-rows"]} ${"button"}`} key={i} onClick={() =>  props.supplierFilter(key)
                }>
                    {key}({sideBarContent.content[key].toString()})
                </SidebarButton>
            )
            i++
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