import {PickListItems} from "../../../server-modules/shop/shop"
import styles from "./print-pick-list.module.css"
import {useEffect} from "react";

export default function PrintShopPickList() {

    if(!global.window) return null
    let data = global.window.localStorage.getItem("pick-list")
    if(!data) return null

    const {date, items} = JSON.parse(data)

    useEffect(() => {
        if (items) window.print()
    }, [items])

    return <div className={styles["local-body"]}>
        <div>{new Date(date).toLocaleDateString("en-GB")}</div>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Qty</th>
                    <th>SKU</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {(items as PickListItems[]).map((item, index) => {
                    return <tr key={index}>
                        <td>{item.quantity}</td>
                        <td>{item.SKU}</td>
                        <td>{item.title}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}