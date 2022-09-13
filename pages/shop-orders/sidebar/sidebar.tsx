import * as React from "react";
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectSideBarContent, setSupplierFilter} from "../../../store/shop-orders-slice";

export default function SideBar() {

    const sideBarContent = useSelector(selectSideBarContent)
    const dispatch = useDispatch()

    function buildSideBar(){
        let elementArray = []
        let i = 0
        for(const order of Object.keys(sideBarContent.content)){
            elementArray.push(
                <div className={`${styles["sidebar-rows"]} ${"button"}`} key={i} onClick={() =>  dispatch(setSupplierFilter(sideBarContent.content[order]))
                }>
                    <span>{order}</span>
                    <span>({sideBarContent.content[order].toString()})</span>
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