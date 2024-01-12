import {useEffect, useState} from "react";
import styles from "./css/shelf-tag.module.css";
import {schema} from "../../../types";
import {toCurrency} from "../../../components/utils/utils";

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
    let {prefix, letter, number} = item.shelfLocation

    return (
        <div className={styles["container"]}>
            <style>{`
                    @page {
                    size: 1.5in 1in;
                    color: black;
                    margin:5px;
                }
            `}</style>
            <div className={styles["details"]}>
                <div className={styles["sku"]}>{item.SKU}</div>
                <div className={styles["price"]}>{item.prices.shop ? toCurrency(item.prices.shop) : toCurrency(item.prices.magento)}</div>
                {prefix || letter || number ? (<div className={styles["loc"]}>{prefix}-{letter}-{number}</div>) : null}
                <div className={styles["title"]}>{item.title}</div>
            </div>
        </div>
    )
}