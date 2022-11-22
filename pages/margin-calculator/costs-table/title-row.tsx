import styles from "../margin-calculator.module.css";

export default function TitleRow(){

    return <div className={`${styles.title} ${styles.row} ${styles["costs-grid"]}`}>
        <div>Packaging</div>
        <div>Cost</div>
        <div>Postage</div>
        <div>Modifier</div>
        <div>Cost</div>
    </div>
}