import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {MarginItem, selectMarginData, selectTableToggles} from "../../store/margin-calculator-slice";

export default function MiscTable() {

    const items = useSelector(selectMarginData)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.MiscTable) return null

    function createTable() {
        const elements = [<TitleRow key={"title-row"}/>]

        for (let item of items) elements.push(<MiscRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={`${styles.row} ${styles["sub-table"]}`}>
        {createTable()}
    </div>;
}

function TitleRow() {
    return <div className={`${styles.title} ${styles.row} ${styles["misc-grid"]}`}>
        <div>Notes</div>
    </div>
}

function MiscRow({item}: { item: MarginItem }) {
    return <div key={item.SKU} className={styles["misc-grid"]}>
        <div><input type={"text"} defaultValue={item.MARGINNOTE}/></div>
    </div>
}