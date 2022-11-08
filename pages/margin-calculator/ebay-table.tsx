import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {MarginItem, selectMarginData, selectTableToggles} from "../../store/margin-calculator-slice";

export default function EbayTable() {

    const items = useSelector(selectMarginData)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.EbayTable) return null

    function createTable(){
        const elements = [<TitleRow key={"title-row"}/>]

        for(let item of items) elements.push(<EbayRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={`${styles.row} ${styles["sub-table"]}`}>
        {createTable()}
    </div>;
}

function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["ebay-grid"]}`}>
        <div>Ebay Price</div>
        <div>Test</div>
        <div>Result</div>
        <div>Ebay Margin</div>
    </div>
}

function EbayRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["ebay-grid"]}`}>
        <div><input defaultValue={item.EBAYPRICEINCVAT}/></div>
        <div></div>
        <div></div>
        <div>£{item.MD.EBAYUKPAVC?.toFixed(2)}</div>
    </div>
}