import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {inputStatusColour} from "../../../components/margin-calculator-utils/margin-styler";
import MarginTestResults from "./margin-test-results";
import MarginCell, {PrimeMarginCell} from "./margin-cell";

export default function ItemRow({item, displayTest}: { item: MarginItem, displayTest: boolean }) {

    if(!item) return null

    const inputRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    const [inputClass, setInputClass] = useState("")

    useEffect(() => {
        if(!inputRef.current) return
        inputRef.current.value = item.AMZPRICEINCVAT
        setInputClass(styles[inputStatusColour(inputRef.current?.value, item, "AMAZON",)])
    }, [item])

    return <div key={item.SKU}
                className={`${styles.row} ${displayTest ? styles["amazon-grid"] : styles["amazon-grid-collapsed"]}`}>
        <div>
            <input ref={inputRef}
                   className={inputClass}
                   defaultValue={item.AMZPRICEINCVAT}
                   onBlur={async(e)=> await updateItem(item,"AMZPRICEINCVAT",e.target.value)}/>
        </div>
        {displayTest ? <MarginTestResults item={item} /> : null}
        <MarginCell item={item}/>
        <div>
            <input type={"checkbox"}
                   defaultChecked={item.AMZPRIME}
                   onChange={async(e)=>await updateItem(item, "AMZPRIME", e.target.checked)}
            />
        </div>
        <PrimeMarginCell item={item}/>
    </div>
}