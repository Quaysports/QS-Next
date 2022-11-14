import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import ItemRow from "./item-row";
import TitleRow from "./title-row";

export default function CostsTable() {

    const items = useSelector(selectRenderedItems)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.CostsTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Costs</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items)elements.push(<ItemRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}