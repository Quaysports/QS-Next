import {useSelector} from "react-redux";
import {selectTotalStockValData} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function TitleRow(){
    const totalStockVal = useSelector(selectTotalStockValData)

    return <div className={`${styles.title} ${styles.row} ${styles["costs-grid"]}`}>
        <div>Pur Price</div>
        <div>Profit LY</div>
        <div>{totalStockVal ? toCurrency(totalStockVal):""}</div>
        <div>Packaging</div>
        <div>Pack Cost</div>
        <div>Postage</div>
        <div>Mod</div>
        <div>Cost</div>
    </div>
}