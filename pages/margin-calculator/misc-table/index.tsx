import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectRenderedItems} from "../../../store/margin-calculator-slice";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {selectMarginSettings} from "../../../store/session-slice";

export default function MiscTable() {

    const items = useSelector(selectRenderedItems)
    const settings = useSelector(selectMarginSettings)

    if(!items || items.length === 0) return null

    if(!settings?.tables.MiscTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Misc"}/>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let index in items) elements.push(<ItemRow key={items[index].SKU}
                                                       item={items[index]}
                                                       index={index}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}