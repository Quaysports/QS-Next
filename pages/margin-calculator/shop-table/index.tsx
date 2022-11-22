import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import ItemRow from "./item-row";
import TitleRow from "./title-row";
import TitleLink from "../title-link";

export default function ShopTable() {

    const items = useSelector(selectRenderedItems)
    const toggles = useSelector(selectTableToggles)

    if(!items || items.length === 0) return null

    if(!toggles.ShopTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Shop"}/>
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