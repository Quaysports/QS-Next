import {MarginItem} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function ItemRow({item}: { item: MarginItem }) {

    if(!item) return null

    return <div key={item.SKU} className={`${styles.row} ${styles["prices-grid"]}`}>
        <div>{toCurrency(item.MD?.TOTALPROFITLY)}</div>
        <div>{toCurrency(item.STOCKVAL)}</div>
    </div>
}