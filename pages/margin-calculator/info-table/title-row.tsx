import styles from "../margin-calculator.module.css";

export default function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["info-grid"]}`}>
        <div></div>
        <div>&#128065;</div>
        <div>SKU</div>
    </div>
}