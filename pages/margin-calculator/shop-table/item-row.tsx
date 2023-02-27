import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import {useEffect, useRef, useState} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import MarginCell from "./margin-cell";
import {toCurrency} from "../../../components/utils/utils";
import {useSelector} from "react-redux";
import RegexInput from "../../../components/regex-input";

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

    async function discountHandler(value: string){
        console.log(value)
        await updateItem(
            item,
            "discounts",
            {...item.discounts, shop: Math.round(Number(value))}
        )
    }

    if (!item) return null

    return <div key={item.SKU}
                className={classes}>
        <div>
            <RegexInput
                errorMessage={"Whole numbers only"}
                handler={discountHandler}
                type={"number"}
                value={item.discounts.shop}/>
        </div>
        <span>{toCurrency(Number(item.prices.shop) - Number(item.prices.retail))}</span>
        <span>{toCurrency(Number(item.prices.shop))}</span>
        <MarginCell item={item}/>
    </div>
}