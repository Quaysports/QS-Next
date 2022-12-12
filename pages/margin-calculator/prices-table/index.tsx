import styles from "../margin-calculator.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectRenderedItems} from "../../../store/margin-calculator-slice";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {selectMarginSettings, updateMarginSetting} from "../../../store/session-slice";
import {useEffect, useState} from "react";

export default function PricesTable() {

    const items = useSelector(selectRenderedItems)
    const settings = useSelector(selectMarginSettings)
    const dispatch = useDispatch()

    const [displayRetail, setDisplayRetail] = useState(settings?.displayRetail)
    useEffect(()=>{ setDisplayRetail(settings?.displayRetail) }, [settings?.displayRetail])

    if (!items || items.length === 0) return null

    if (!settings?.tables.PricesTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Prices"}/>
                <div className={styles["info-title-checkbox"]}>
                    Retail:<input type={"checkbox"}
                                  checked={displayRetail}
                                  onChange={(e) => {
                                      let newSettings = structuredClone(settings!)
                                      newSettings.displayRetail = e.target.checked
                                      dispatch(updateMarginSetting(newSettings))
                                  }}/></div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for (let index in items) elements.push(<ItemRow key={items[index].SKU} item={items[index]} index={index}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}