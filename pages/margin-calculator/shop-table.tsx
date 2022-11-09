import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    MarginItem,
    selectRenderedItems,
    selectTableToggles
} from "../../store/margin-calculator-slice";

export default function ShopTable() {

    const items = useSelector(selectRenderedItems)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.ShopTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Shop</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<ShopRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}

function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["shop-grid"]}`}>
        <div>Shop Price</div>
        <div>Shop Margin</div>
    </div>
}

function ShopRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["shop-grid"]}`}>
        <div><input defaultValue={item.SHOPPRICEINCVAT}/></div>
        <div>£{item.MD.SHOPPAVC?.toFixed(2)}</div>
    </div>
}