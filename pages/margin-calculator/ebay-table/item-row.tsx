import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {inputStatusColour} from "../../../components/margin-calculator-utils/margin-styler";
import MarginTestResults from "./margin-test-results";
import MarginCell from "./margin-cell";
import {useSelector} from "react-redux";

export default function ItemRow({item, displayTest, index}: { item: MarginItem, displayTest: boolean, index:string}) {

    const inputRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    const [inputClass, setInputClass] = useState("")

    useEffect(() => {
        if(!inputRef.current) return
        inputRef.current.value = String(item.prices.ebay)
        setInputClass(styles[inputStatusColour(inputRef.current?.value, item, "ebay",)])
    }, [item])

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(() => {setClasses(cssClasses())}, [activeIndex])

    function cssClasses() {
        let classes = styles.row
        classes += displayTest ? ` ${styles["ebay-grid"]}` : ` ${styles["ebay-grid-collapsed"]}`
        classes += activeIndex === index ? ` ${styles["active"]}` : ""
        return classes
    }

    if(!item) return null

    return <div key={item.SKU}
                className={classes}>
        <div>
            <input
                ref={inputRef}
                className={inputClass}
                defaultValue={item.prices.ebay}
                onBlur={async(e)=>{
                    const update = {...item.prices, ebay: Number(e.target.value)}
                    await updateItem(item,"prices", update)
                }}/>
        </div>
        {displayTest ? <MarginTestResults item={item}/> : null}
        <MarginCell item={item}/>
    </div>
}