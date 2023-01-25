import styles from './css/branded-label.module.css'
import {useEffect, useState} from "react";
import {schema} from "../../../types";

export default function BrandedLabel() {

    const [item, setItem] = useState<schema.Item | null>(null)

    useEffect(() => {
        const data = window.localStorage.getItem("item")
        data ? setItem(JSON.parse(data)): null
    },[])

    useEffect(() => {
        if(item) setTimeout(() => window.print(), 200)
    }, [item])

    if(!item) return null
    let {prefix, letter, number} = item.shelfLocation

    return (
        <div className={styles["container"]}>
            <style>{`
                        @page {
        size: 45mm 25mm;
        margin: 0;
        padding: 0;
    }`}</style>
            <div className={styles["image"]}>
                <img src={item.brandLabel.path} alt={item.brand + " image"}/>
            </div>
            <div className={styles["details"]}>
                <div className={styles["brand"]}>{item.brand}</div>
                <div className={styles["title1"]}>{item.brandLabel.title1}</div>
                <div className={styles["title2"]}>{item.brandLabel.title2}</div>
                <div className={styles["price"]}>£{item.prices.shop}</div>
                <div className={styles["loc"]}>{prefix}-{letter}-{number}</div>
            </div>
        </div>
    )
}