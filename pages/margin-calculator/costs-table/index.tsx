import styles from "../margin-calculator.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectRenderedItems} from "../../../store/margin-calculator-slice";
import ItemRow from "./item-row";
import TitleRow from "./title-row";
import TitleLink from "../title-link";
import {selectMarginSettings, updateMarginSetting} from "../../../store/session-slice";
import {useEffect, useState} from "react";

export default function CostsTable() {

    const items = useSelector(selectRenderedItems)
    const settings = useSelector(selectMarginSettings)
    const dispatch = useDispatch()

    const [displayPackaging, setDisplayPackaging] = useState(settings?.displayPackaging)
    useEffect(()=>{ setDisplayPackaging(settings?.displayPackaging) }, [settings?.displayPackaging])

    if (!items || items.length === 0) return null

    if (!settings?.tables.CostsTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Costs"}/>
                <div className={styles["info-title-checkbox"]}>
                    Packaging:<input type={"checkbox"}
                                     checked={displayPackaging}
                                     onChange={(e) => {
                                         let newSettings = structuredClone(settings!)
                                         newSettings.displayPackaging = e.target.checked
                                         dispatch(updateMarginSetting(newSettings))
                                     }}/></div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for (let index in items) elements.push(<ItemRow key={items[index].SKU + "-costs"}
                                                        item={items[index]}
                                                        index={index}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}