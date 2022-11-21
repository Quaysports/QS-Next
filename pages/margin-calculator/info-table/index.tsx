import styles from "../margin-calculator.module.css";
import {
    selectDisplayTitles,
    selectRenderedItems,
    selectTableToggles, toggleDisplayTitles,
} from "../../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {useEffect, useState} from "react";

export default function InfoTable(){

    const items = useSelector(selectRenderedItems)
    const toggles = useSelector(selectTableToggles)
    const displayTitles = useSelector(selectDisplayTitles)
    const dispatch = useDispatch()

    if(!items || items.length === 0) return null

    if(!toggles.InfoTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Info"}/>
                <div className={styles["info-title-checkbox"]}>
                    Titles:<input type={"checkbox"}
                                  checked={displayTitles}
                                  onChange={()=>{dispatch(toggleDisplayTitles())}}/></div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<ItemRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>
}