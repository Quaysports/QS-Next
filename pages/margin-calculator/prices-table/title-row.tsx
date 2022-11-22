import styles from "../margin-calculator.module.css";

export default function TitleRow() {
    return <div className={`${styles.title} ${styles.row} ${styles["prices-grid"]}`}>
        <div>Purchase Price</div>
        <div>Retail Price</div>
    </div>
}