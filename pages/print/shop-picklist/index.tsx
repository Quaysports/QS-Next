import {PickListItem} from "../../../server-modules/shop/shop"
import styles from "./print-pick-list.module.css"
import {useEffect} from "react";

export default function PrintShopPickList() {

    if (!global.window) return null
    let data = global.window.localStorage.getItem("pick-list")
    if (!data) return null

    const {date, items} = JSON.parse(data)

    useEffect(() => {
        if (items) window.print()
    }, [items])

    return <div className={styles["local-body"]}>
        <style>
            {`@page {
                size: A4 portrait;
                margin: 10mm;
            }`}
        </style>
        <div>{new Date(date).toLocaleDateString("en-GB")}</div>
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Qty</th>
                <th>Stock</th>
                <th>SKU</th>
                <th>Title</th>
            </tr>
            </thead>
            <tbody>
            {(items as PickListItem[]).map((item, index) => {
                return <tr key={index}>
                    <td>{item.quantity}</td>
                    <td>{item.stock.total < 100 ? item.stock.total : "99+"}</td>
                    <td>{item.SKU}</td>
                    <td>{item.title}</td>
                </tr>
            })}
            </tbody>
        </table>
    </div>
}