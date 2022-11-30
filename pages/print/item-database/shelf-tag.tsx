import {useEffect, useState} from "react";
import styles from "./css/shelf-tag.module.css";

export default function ShelfTag() {

    const [item, setItem] = useState<sbt.Item | null>(null)

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
}
`}</style>
            <div className={styles["container"]}>
                <div className={styles["sku"]}>{item.SKU}</div>
                <div
                    className={styles["price"]}>£{item.SHOPPRICEINCVAT ? parseFloat(item.SHOPPRICEINCVAT).toFixed(2) : parseFloat(item.QSPRICEINCVAT!).toFixed(2)}</div>
            </div>
            <div className={styles["title"]}>{item.TITLE}</div>
        </>
    )
}