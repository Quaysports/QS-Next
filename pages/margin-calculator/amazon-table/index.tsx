import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import TitleRow from "./title-row";
import ItemRow from "./item-row"
import TitleLink from "../title-link";

export default function AmazonTable() {

    const items = useSelector(selectRenderedItems)
    const toggles = useSelector(selectTableToggles)
    const [toggleMarginTest, setToggleTest] = useState<boolean>(false)

    if(!items || items.length === 0) return null

    if (!toggles.AmazonTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <div><TitleLink type={"Amazon"}/></div>
                <div>
                    <button onClick={() => setToggleTest(!toggleMarginTest)}>Margin Tests</button>
                </div>
            </div>,
            <TitleRow key={"title-row"} displayTest={toggleMarginTest}/>
        ]

        for (let item of items) elements.push(
            <ItemRow key={item.SKU} item={item} displayTest={toggleMarginTest}/>
        )
        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}