import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    MarginItem,
    selectRenderedItems,
    selectTableToggles
} from "../../store/margin-calculator-slice";

export default function MiscTable() {

    const items = useSelector(selectRenderedItems)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.MiscTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>Misc</div>,
            <TitleRow key={"title-row"}/>
        ]

        for (let item of items) elements.push(<MiscRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}

function TitleRow() {
    return <div className={`${styles.title} ${styles.row} ${styles["misc-grid"]}`}>
        <div>Notes</div>
    </div>
}

function MiscRow({item}: { item: MarginItem }) {
    return <div key={item.SKU} className={`${styles.row} ${styles["misc-grid"]}`}>
        <span><input type={"text"} defaultValue={item.MARGINNOTE}/></span>
    </div>
}