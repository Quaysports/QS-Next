import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import {useSelector} from "react-redux";
import {selectMarginSettings} from "../../../store/session-slice";

export default function ItemRow({item, index}: { item: MarginItem, index:string }) {

    const activeIndex = useSelector(selectActiveIndex)
    const settings = useSelector(selectMarginSettings)

    if(!item) return null

    return <div key={item.SKU} className={`${
        styles.row
    } ${
        settings?.displayRetail ? styles["prices-grid"] : styles["prices-grid-collapsed"]
    } ${
        activeIndex === index ? ` ${styles["active"]}` : ""}`
    }>
        <div>{toCurrency(Number(item.PURCHASEPRICE))}</div>
        {settings?.displayRetail ? <div>{toCurrency(Number(item.RETAILPRICE))}</div> : null}
    </div>
}