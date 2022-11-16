import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {inputStatusColour} from "../../../components/margin-calculator-utils/margin-styler";
import MarginTestResults from "./margin-test-results";
import MarginCell from "./margin-cell";

export default function ItemRow({item, test}: { item: MarginItem, test: boolean}) {

    if(!item) return null

    const inputRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    const [inputClass, setInputClass] = useState("")

    useEffect(() => {
        if(!inputRef.current) return
        inputRef.current.value = item.EBAYPRICEINCVAT
        setInputClass(styles[inputStatusColour(inputRef.current?.value, item, "EBAY",)])
    }, [item])

    return <div key={item.SKU}
                className={`${styles.row} ${test ? styles["ebay-grid"] : styles["ebay-grid-collapsed"]}`}>
        <div>
            <input
                ref={inputRef}
                className={inputClass}
                defaultValue={item.EBAYPRICEINCVAT}
                onBlur={async(e)=> await updateItem(item,"EBAYPRICEINCVAT",e.target.value)}/>
        </div>
        {test ? <MarginTestResults item={item}/> : null}
        <MarginCell item={item}/>
    </div>
}