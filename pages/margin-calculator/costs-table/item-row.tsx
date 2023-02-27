import {MarginItem, selectActiveIndex, selectPackaging} from "../../../store/margin-calculator-slice";
import {useSelector} from "react-redux";
import styles from "../margin-calculator.module.css";
import PostSelect from "./post-select";
import PostModSelect from "./postmod-select";
import {toCurrency} from "../../../components/utils/utils";
import {selectMarginSettings} from "../../../store/session-slice";

export default function ItemRow({item, index}: { item: MarginItem, index:string}) {

    const packaging = useSelector(selectPackaging)
    const settings = useSelector(selectMarginSettings)
    const activeIndex = useSelector(selectActiveIndex)

    if(!item) return null

    return <div key={item.SKU} className={`${
        styles.row
    } ${
        settings?.displayPackaging ? styles["costs-grid"] : styles["costs-grid-collapsed"]
    } ${
        activeIndex === index ? ` ${styles["active"]}` : ""}`
    }>
        {settings?.displayPackaging ? <span>{packaging ? packaging[item.packaging.group]?.name : ""}</span> : null}
        {settings?.displayPackaging ? <div>{packaging ? toCurrency(packaging[item.packaging.group]?.price) : ""}</div> : null}
        <div><PostSelect item={item}/></div>
        <div><PostModSelect item={item}/></div>
        <div>{toCurrency(item.marginData.postage)}</div>
    </div>
}