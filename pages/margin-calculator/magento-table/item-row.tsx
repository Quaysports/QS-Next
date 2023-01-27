import {
    MarginItem,
    selectActiveIndex
} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {inputStatusColour} from "../../../components/margin-calculator-utils/margin-styler";
import MarginCell from "./margin-cell";
import {useRouter} from "next/router"
import {currencyToLong, toCurrency, toCurrencyInput} from "../../../components/margin-calculator-utils/utils";
import {useSelector} from "react-redux";

export default function ItemRow({item, index}: { item: MarginItem, index:string }) {

    const router = useRouter()
    const domestic = router.query.domestic === "true"
    const inputRef = useRef<HTMLInputElement>(null)
    const discountRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    const [inputClass, setInputClass] = useState("")

    useEffect(() => {
        if (!inputRef.current) return
        inputRef.current.value = String(toCurrencyInput(item.prices.magento))
        setInputClass(styles[inputStatusColour(inputRef.current?.value, item, "magento",)])

        if (!discountRef.current) return
        discountRef.current.value = String(item.discounts.magento)

    }, [item])

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(()=>{setClasses(cssClasses())},[activeIndex, domestic])

    function cssClasses(){
        let classes = styles.row
        classes += domestic ? ` ${styles["magento-grid-discount"]}` : ` ${styles["magento-grid"]}`
        classes += activeIndex === index ? ` ${styles["active"]}` : ""
        return classes
    }

    if (!item) return null

    return <div key={item.SKU}
                className={classes}>
        {domestic ?
            <div>
                <input ref={discountRef}
                       type={"number"}
                       defaultValue={item.discounts.magento}
                       onBlur={async (e) => {
                           const update = {...item.discounts, magento: Number(e.target.value)}
                           await updateItem(item, "discounts", update)
                       }}/>
            </div> : null
        }
        {domestic ? <span>{toCurrency(Number(item.prices.magento) - Number(item.prices.retail))}</span> : null}
        <div>
            <input ref={inputRef}
                   className={inputClass}
                   defaultValue={toCurrencyInput(item.prices.magento)}
                   readOnly={domestic}
                   onBlur={async (e) => {
                          const update = {...item.prices, magento: currencyToLong(e.target.value)}
                       await updateItem(item, "prices", update)
                   }}/>
        </div>
        <MarginCell item={item}/>
    </div>
}