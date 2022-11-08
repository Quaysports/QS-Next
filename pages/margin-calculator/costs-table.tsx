import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {MarginItem, selectMarginData, selectTableToggles} from "../../store/margin-calculator-slice";

export default function CostsTable() {

    const items = useSelector(selectMarginData)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.CostsTable) return null

    function createTable(){
        const elements = [<TitleRow key={"title-row"}/>]

        for(let item of items) elements.push(<CostsRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={`${styles.row} ${styles["sub-table"]}`}>
        {createTable()}
    </div>;
}

function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["costs-grid"]}`}>
        <div>Pur Price</div>
        <div>Profit LY</div>
        <div>$$</div>
        <div>Packaging</div>
        <div>Pack Cost</div>
        <div>Postage</div>
        <div>Mod</div>
        <div>Cost</div>
    </div>
}

function CostsRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["costs-grid"]}`}>
        <div>£{item.PURCHASEPRICE.toFixed(2)}</div>
        <div>{item.MD?.TOTALPROFITLY ? `£${item.MD.TOTALPROFITLY?.toFixed(2)}` :""}</div>
        <div>{item.STOCKVAL ? `£${item.STOCKVAL.toFixed(2)}` :""}</div>
        <div>Packaging</div>
        <div>Pack Cost</div>
        <div><select></select></div>
        <div><select></select></div>
        <div>Cost</div>
    </div>
}