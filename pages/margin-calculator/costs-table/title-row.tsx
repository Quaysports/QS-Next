import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectMarginSettings} from "../../../store/session-slice";

export default function TitleRow(){

    const settings = useSelector(selectMarginSettings)

    return <div className={`${
        styles.title
    } ${
        styles.row
    } ${
        settings?.displayPackaging ? styles["costs-grid"] : styles["costs-grid-collapsed"]}`
    }>
        {settings?.displayPackaging ? <div>Packaging</div> : null }
        {settings?.displayPackaging ? <div>Cost</div> : null}
        <div>Postage</div>
        <div>Modifier</div>
        <div>Cost</div>
    </div>
}