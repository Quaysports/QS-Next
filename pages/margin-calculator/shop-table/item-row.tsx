import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {inputStatusColour} from "../../../components/margin-calculator-utils/margin-styler";
import MarginCell from "./margin-cell";

export default function ItemRow({item}: { item: MarginItem }) {

    if(!item) return null

    const inputRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    const [inputClass, setInputClass] = useState("")

    useEffect(() => {
        if(!inputRef.current) return
        //inputRef.current.value = item.SHOPPRICEINCVAT
        //setInputClass(styles[inputStatusColour(inputRef.current?.value, item, "SHOP",)])
    }, [item])

    return <div key={item.SKU} className={`${styles.row} ${styles["shop-grid"]}`}>
        <div>
            <input ref={inputRef}
                   className={inputClass}
                   defaultValue={item.SHOPPRICEINCVAT}
                   onBlur={async (e) => await updateItem(item, "SHOPPRICEINCVAT", e.target.value)}/>
        </div>
        <MarginCell item={item}/>
    </div>
}