import styles from '../shop-tills.module.css'

export default function QuickLinkButton({sku, price, title}) {
    return (
        <>
            <div className={styles["quick-link-table-button"]}>
                <div>{sku}</div>
                <div>{price}</div>
                <div>{title}</div>
            </div>
        </>
    )
}