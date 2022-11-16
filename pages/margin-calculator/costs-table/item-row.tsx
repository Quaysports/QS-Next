import {MarginItem, selectPackaging} from "../../../store/margin-calculator-slice";
import {useSelector} from "react-redux";
import styles from "../margin-calculator.module.css";
import PostSelect from "./post-select";
import PostModSelect from "./postmod-select";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import PurchasePriceCell from "./purchase-price-cell";

export default function ItemRow({item}: { item: MarginItem }) {

    if(!item) return null

    const packaging = useSelector(selectPackaging)

    return <div key={item.SKU} className={`${styles.row} ${styles["costs-grid"]}`}>
        <div><PurchasePriceCell item={item}/></div>
        <div>{toCurrency(item.MD?.TOTALPROFITLY)}</div>
        <div>{toCurrency(item.STOCKVAL)}</div>
        <span>{packaging ? packaging[item.PACKGROUP].NAME : ""}</span>
        <div>{packaging ? toCurrency(packaging[item.PACKGROUP].PRICE) : ""}</div>
        <div><PostSelect item={item}/></div>
        <div><PostModSelect item={item}/></div>
        <div>{toCurrency(item.MD.POSTALPRICEUK)}</div>
    </div>
}