import * as React from "react";
import styles from "../shop-orders.module.css"
import {useSelector} from "react-redux";
import {selectSideBarContent} from "../../../store/shop-orders-slice";

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
                <div className={`${styles["sidebar-rows"]} ${"button"}`} key={i} onClick={() =>  props.supplierFilter(key)
                }>
                    <span>{key}</span>
                    <span>({sideBarContent.content[key].toString()})</span>
                </div>
            )
            i++
        }

        return elementArray
    }

    return (
        <div className={styles["shop-orders-sidebar"]}>
            <div key={1} id={styles["sidebar-title"]}>{sideBarContent.title}</div>
            {buildSideBar()}
        </div>
    )
};