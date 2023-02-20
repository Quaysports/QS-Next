import {useEffect, useState} from "react";
import styles from './css/rod-tag.module.css'
import {schema} from "../../../types";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function RodTag() {

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
            <style>{`@page {
                size: 1.5in 1in;
                color: black;
                margin:0px 5px;
            }`}</style>
            <div className={styles["details"]}>
                <div className={styles["brand"]}>{item.brand}</div>
                <div className={styles["title1"]}>{item.brandLabel.title1}</div>
                <div className={styles["title2"]}>{item.brandLabel.title2}</div>
                <div className={styles["price"]}>{item.prices.shop ? toCurrency(item.prices.shop) : toCurrency(item.prices.magento)}</div>
                <div className={styles["loc"]}>{prefix}-{letter}-{number}</div>
            </div>
        </div>
    )
}