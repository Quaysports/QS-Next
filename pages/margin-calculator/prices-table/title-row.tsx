import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectMarginSettings} from "../../../store/session-slice";

export default function TitleRow() {
    const settings = useSelector(selectMarginSettings)
    return <div className={`${styles.title} ${styles.row} ${settings?.displayRetail ? styles["prices-grid"] : styles["prices-grid-collapsed"]}`}>
        <div>Purchase Price</div>
        {settings?.displayRetail ? <div>Retail Price</div> : null}
    </div>
}