import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import TitleRow from "./title-row";
import ItemRow from "./item-row";

export default function MagentoTable() {

    const items = useSelector(selectRenderedItems)

    if(!items || items.length === 0) return null

    const toggles = useSelector(selectTableToggles)
    if(!toggles.MagentoTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Magento</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<ItemRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}