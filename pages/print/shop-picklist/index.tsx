import {PickLinkItems} from "../../../server-modules/shop/shop"
import styles from "./print-pick-list.module.css"

export default function PrintShopPickList() {

    if(!global.window) return null
    let data = global.window.localStorage.getItem("pick-list")
    if(!data) return null

    const items = JSON.parse(data) as PickLinkItems[]
    console.log(items)
    return <div className={styles["local-body"]}>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Qty</th>
                    <th>SKU</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => {
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