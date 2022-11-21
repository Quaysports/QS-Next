import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

export default function ItemRow({item, index}: { item: MarginItem, index:string }) {

    const updateItem = useUpdateItemAndCalculateMargins()

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(()=>{setClasses(cssClasses())},[activeIndex])

    function cssClasses(){
        return `${styles.row} ${styles["misc-grid"]} ${activeIndex === index ? ` ${styles["active"]}` : ""}`
    }

    if(!item) return null

    return <div key={item.SKU} className={classes}>
        <span>
            <input
                type={"text"}
                defaultValue={item.MARGINNOTE}
                onBlur={async(e)=> await updateItem(item,"MARGINNOTE",e.target.value)}
            /></span>
    </div>
}