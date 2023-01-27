import {useEffect, useState} from "react";
import styles from "./css/shelf-tag.module.css";
import {schema} from "../../../types";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function ShelfTag() {

    const [item, setItem] = useState<schema.Item | null>(null)

    useEffect(() => {
        const data = window.localStorage.getItem("item")
        data ? setItem(JSON.parse(data)) : null
    }, [])

    useEffect(() => {
        if (item) window.print()
    }, [item])

    if (!item) return null

    return (
        <>
            <style>{`
                    @page {
    size: 1.5in 1in;
    color: black;
    margin:5px;
}
`}</style>
            <div className={styles["container"]}>
                <div className={styles["sku"]}>{item.SKU}</div>
                <div
                    className={styles["price"]}>{item.prices.shop ? toCurrency(item.prices.shop) : toCurrency(item.prices.magento)}</div>
            </div>
            <div className={styles["title"]}>{item.title}</div>
        </>
    )
}