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

    if(!items || items.length === 0) return null

    const toggles = useSelector(selectTableToggles)
    if (!toggles.EbayTable) return null

    const [toggleMarginTest, setToggleTest] = useState<boolean>(false)

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