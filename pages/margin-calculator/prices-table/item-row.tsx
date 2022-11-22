import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

export default function ItemRow({item, index}: { item: MarginItem, index:string }) {

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(()=>{setClasses(cssClasses())},[activeIndex])

    function cssClasses(){
        return `${styles.row} ${styles["prices-grid"]} ${activeIndex === index ? ` ${styles["active"]}` : ""}`
    }

    if(!item) return null

    return <div key={item.SKU} className={classes}>
        <div>{toCurrency(Number(item.PURCHASEPRICE))}</div>
        <div>{toCurrency(Number(item.RETAILPRICE))}</div>
    </div>
}