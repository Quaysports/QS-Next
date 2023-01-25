import {useEffect, useState} from "react";
import styles from "./css/tag.module.css"
import {schema} from "../../../types";

export default function Tag() {

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
                    margin: 0;
                }`}</style>
            <div className={styles["label"]}>

                <div className={styles["sku"]}>{item.SKU}</div>
                <div
                    className={styles["price"]}>£{item.prices.shop ? item.prices.shop.toFixed(2) : item.prices.magento!.toFixed(2)}</div>
                <div className={styles["title"]}>{item.title}</div>
            </div>
        </>
    )
}