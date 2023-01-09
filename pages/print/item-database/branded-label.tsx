import styles from './css/branded-label.module.css'
import {useEffect, useState} from "react";

export default function BrandedLabel() {

    const [item, setItem] = useState<sbt.Item | null>(null)

    useEffect(() => {
        const data = window.localStorage.getItem("item")
        data ? setItem(JSON.parse(data)): null
    },[])

    useEffect(() => {
        if(item) setTimeout(() => window.print(), 200)
    }, [item])

    if(!item) return null
    let {PREFIX, LETTER, NUMBER} = item.SHELFLOCATION

    return (
        <div className={styles["container"]}>
            <style>{`
                        @page {
        size: 45mm 25mm;
        margin: 0;
        padding: 0;
    }`}</style>
            <div className={styles["image"]}>
                <img src={item.BRANDLABEL.path} alt={item.IDBEP.BRAND + " image"}/>
            </div>
            <div className={styles["details"]}>
                <div className={styles["brand"]}>{item.IDBEP.BRAND}</div>
                <div className={styles["title1"]}>{item.BRANDLABEL.title1}</div>
                <div className={styles["title2"]}>{item.BRANDLABEL.title2}</div>
                <div className={styles["price"]}>£{item.SHOPPRICEINCVAT}</div>
                <div className={styles["loc"]}>{PREFIX}-{LETTER}-{NUMBER}</div>
            </div>
        </div>
    )
}