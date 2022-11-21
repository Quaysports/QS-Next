import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import {inputStatusColour} from "../../../components/margin-calculator-utils/margin-styler";
import MarginCell from "./margin-cell";
import {useRouter} from "next/router"
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function ItemRow({item}: { item: MarginItem }) {

    const router = useRouter()
    const domestic = router.query.domestic === "true"
    const inputRef = useRef<HTMLInputElement>(null)
    const discountRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    const [inputClass, setInputClass] = useState("")

    useEffect(() => {
        if (!inputRef.current) return
        inputRef.current.value = item.QSPRICEINCVAT
        setInputClass(styles[inputStatusColour(inputRef.current?.value, item, "MAGENTO",)])

        if (!discountRef.current) return
        discountRef.current.value = item.QSDISCOUNT ? item.QSDISCOUNT.toString() : "0"
    }, [item])

    if (!item) return null

    return <div key={item.SKU}
                className={`${styles.row} ${domestic ? styles["magento-grid-discount"] : styles["magento-grid"]}`}>
        {domestic ?
            <div>
                <input ref={discountRef}
                       type={"number"}
                       defaultValue={item.QSDISCOUNT}
                       onBlur={async (e) => {
                           await updateItem(item, "QSDISCOUNT", Number(e.target.value))
                       }}/>
            </div> : null
        }
        {domestic ? <span>{toCurrency(Number(item.QSPRICEINCVAT) - Number(item.RETAILPRICE))}</span> : null}
        <div>
            <input ref={inputRef}
                   className={inputClass}
                   defaultValue={item.QSPRICEINCVAT}
                   readOnly={domestic}
                   onBlur={async (e) => {
                       await updateItem(item, "QSPRICEINCVAT", e.target.value)
                   }}/>
        </div>
        <MarginCell item={item}/>
    </div>
}