import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    MarginItem,
    selectRenderedItems,
    selectTableToggles
} from "../../store/margin-calculator-slice";

export default function MagentoTable() {

    const items = useSelector(selectRenderedItems)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.MagentoTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Magento</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<MagentoRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}

function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["magento-grid"]}`}>
        <div>QS Price</div>
        <div>QS Margin</div>
    </div>
}

function MagentoRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["magento-grid"]}`}>
        <div><input defaultValue={item.QSPRICEINCVAT}/></div>
        <div>£{item.MD.QSPAVC?.toFixed(2)}</div>
    </div>
}