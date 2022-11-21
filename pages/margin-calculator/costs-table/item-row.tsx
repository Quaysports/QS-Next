import {MarginItem, selectActiveIndex, selectPackaging} from "../../../store/margin-calculator-slice";
import {useSelector} from "react-redux";
import styles from "../margin-calculator.module.css";
import PostSelect from "./post-select";
import PostModSelect from "./postmod-select";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import {useEffect, useState} from "react";

export default function ItemRow({item, index}: { item: MarginItem, index:string}) {

    const packaging = useSelector(selectPackaging)

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(()=>{setClasses(cssClasses())},[activeIndex])

    function cssClasses(){
        return `${styles.row} ${styles["costs-grid"]} ${activeIndex === index ? ` ${styles["active"]}` : ""}`
    }

    if(!item) return null

    return <div key={item.SKU} className={classes}>
        <span>{packaging ? packaging[item.PACKGROUP].NAME : ""}</span>
        <div>{packaging ? toCurrency(packaging[item.PACKGROUP].PRICE) : ""}</div>
        <div><PostSelect item={item}/></div>
        <div><PostModSelect item={item}/></div>
        <div>{toCurrency(item.MD.POSTALPRICEUK)}</div>
    </div>
}