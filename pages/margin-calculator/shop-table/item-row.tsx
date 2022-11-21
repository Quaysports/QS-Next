import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useRef} from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import MarginCell from "./margin-cell";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function ItemRow({item}: { item: MarginItem }) {

    const discountRef = useRef<HTMLInputElement>(null)
    const updateItem = useUpdateItemAndCalculateMargins()

    useEffect(() => {
        if (!discountRef.current) return
        discountRef.current.value = item.SHOPDISCOUNT ? item.SHOPDISCOUNT.toString() : "0"
    }, [item])

    if (!item) return null

    return <div key={item.SKU}
                className={`${styles.row} ${styles["shop-grid"]}`}>
        <div>
            <input ref={discountRef}
                   type={"number"}
                   defaultValue={item.SHOPDISCOUNT ? item.SHOPDISCOUNT : 0}
                   onBlur={async (e) => {
                       await updateItem(item, "SHOPDISCOUNT", Number(e.target.value))
                   }}/>
        </div>
        <span>{toCurrency(Number(item.SHOPPRICEINCVAT) - Number(item.RETAILPRICE))}</span>
        <span>{toCurrency(Number(item.SHOPPRICEINCVAT))}</span>
        <MarginCell item={item}/>
    </div>
}