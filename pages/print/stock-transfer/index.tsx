import styles from "./print-stock-transfer.module.css";
import {useEffect} from "react";

export default function PrintStockTransfer() {

    if (!global.window) return null
    let data = global.window.localStorage.getItem("transfer-list")
    if (!data) return null

    useEffect(() => {
        if (data) window.print()
    }, [data])

    const parsedData = JSON.parse(data)
    if(!parsedData) return null

    return <div className={styles["local-body"]}>
        <style>
            {`@page {
                size: A4 portrait;
                margin: 10mm;
            }`}
        </style>
        <div className={styles['stock-transfer-grid']}>
            <div className={styles['stock-transfer-grid-row']}>
                <div>SKU</div>
                <div>Qty Required</div>
                <div>Qty Transferred</div>
                <div>Notes</div>
            </div>
            {(parsedData as any[]).map((item, index) => {
                return (
                <div key={index} className={styles['stock-transfer-grid-row']}>
                    <div style={{textAlign: 'left'}}>{item.SKU}</div>
                    <div>{item.transfer}</div>
                    <div></div>
                    <div></div>
                </div>
                )
            })}
        </div>
    </div>
}