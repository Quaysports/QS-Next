import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import ItemRow from "./item-row";
import TitleRow from "./title-row";

export default function EbayTable() {

    const items = useSelector(selectRenderedItems)
    const toggles = useSelector(selectTableToggles)
    const [toggleMarginTest, setToggleTest] = useState<boolean>(false)

    if(!items || items.length === 0) return null

    if (!toggles.EbayTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <div>Ebay</div>
                <div>
                    <button onClick={() => setToggleTest(!toggleMarginTest)}>Margin Tests</button>
                </div>
            </div>,
            <TitleRow key={"title-row"} test={toggleMarginTest}/>
        ]

        for (let item of items) elements.push(
            <ItemRow key={item.SKU} item={item} test={toggleMarginTest}/>
        )

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}