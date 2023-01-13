import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import MarginCell from "./margin-cell";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import {useSelector} from "react-redux";

export default function ItemRow({item, index}: { item: MarginItem, index: string }) {

    const discountRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    useEffect(() => {
        if (!discountRef.current) return
        discountRef.current.value = String(item.discounts.shop)
    }, [item])

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(() => {
        setClasses(cssClasses())
    }, [activeIndex])

    function cssClasses() {
        return `${styles.row} ${styles["shop-grid"]} ${activeIndex === index ? ` ${styles["active"]}` : ""}`
    }

    if (!item) return null

    return <div key={item.SKU}
                className={classes}>
        <div>
            <input ref={discountRef}
                   type={"number"}
                   defaultValue={item.discounts.shop}
                   onBlur={async (e) => {
                       const update = {...item.discounts, shop: Number(e.target.value)}
                       await updateItem(item, "discounts", update)
                   }}/>
        </div>
        <span>{toCurrency(Number(item.prices.shop) - Number(item.prices.retail))}</span>
        <span>{toCurrency(Number(item.prices.shop))}</span>
        <MarginCell item={item}/>
    </div>
}