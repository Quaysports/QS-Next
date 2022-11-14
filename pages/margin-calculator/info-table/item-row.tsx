import {MarginItem} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";

export default function ItemRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["info-grid"]}`}>
        <div></div>
        <div><input type={"checkbox"} defaultChecked={item.HIDE}/></div>
        <span>{item.SKU}</span>
    </div>
}