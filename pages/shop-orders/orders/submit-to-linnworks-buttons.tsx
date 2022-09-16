import * as React from "react"
import styles from "../shop-orders.module.css"

export default function SubmitToLinnworksButtons() {
    return (
        <span className={styles["primary-buttons"]}>
                    <button>Submit To Linnworks</button>
                    <button>Complete Order</button>
                </span>
    )
}