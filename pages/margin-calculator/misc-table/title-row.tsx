import styles from "../margin-calculator.module.css";

export default function TitleRow() {
    return <div className={`${styles.title} ${styles.row} ${styles["misc-grid"]}`}>
        <div>Notes</div>
    </div>
}