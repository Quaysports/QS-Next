import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectRenderedItems} from "../../../store/margin-calculator-slice";
import ItemRow from "./item-row";
import TitleRow from "./title-row";
import TitleLink from "../title-link";
import {selectMarginSettings} from "../../../store/session-slice";

export default function CostsTable() {

    const items = useSelector(selectRenderedItems)
    const settings = useSelector(selectMarginSettings)

    if (!items || items.length === 0) return null

    if (!settings?.tables.CostsTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Costs"}/>
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