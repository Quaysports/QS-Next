import {useEffect, useState} from "react";
import styles from "./css/shelf-tag.module.css";

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
                    className={styles["price"]}>£{item.prices.shop ? item.prices.shop.toFixed(2) : item.prices.magento.toFixed(2)}</div>
            </div>
            <div className={styles["title"]}>{item.title}</div>
        </>
    )
}