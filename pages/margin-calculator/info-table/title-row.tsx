import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectDisplayTitles} from "../../../store/margin-calculator-slice";

export default function TitleRow(){

    const displayTitles = useSelector(selectDisplayTitles)

    return <div className={`${styles.title} ${styles.row} ${displayTitles ? styles["info-grid"] : styles["info-grid-collapsed"]}`}>
        <div>&#127760;</div>
        <div>&#128065;</div>
        <div>SKU</div>
        {displayTitles ? <span>Title</span> : null}
    </div>
}