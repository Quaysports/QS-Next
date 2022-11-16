import styles from "../margin-calculator.module.css";
import {
    selectRenderedItems,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import {useSelector} from "react-redux";
import TitleRow from "./title-row";
import ItemRow from "./item-row";

export default function InfoTable(){

    const items = useSelector(selectRenderedItems)
    const toggles = useSelector(selectTableToggles)

    if(!items || items.length === 0) return null

    if(!toggles.InfoTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Info</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<ItemRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>
}