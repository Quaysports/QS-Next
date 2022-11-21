import styles from "../margin-calculator.module.css";

export default function TitleRow() {
    return <div className={`${styles.title} ${styles.row} ${styles["prices-grid"]}`}>
        <div>Profit Last Year</div>
        <div>Stock Value</div>
    </div>
}