import {useDispatch, useSelector} from "react-redux";
import {selectCurrentSort, sortMarginData} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import styles from "../margin-calculator.module.css";
import {MarginTestTitle} from "./margin-test-results";

export default function TitleRow({test}: { test: boolean}) {

    const currentSort = useSelector(selectCurrentSort)
    const [ascendingSort, setAscendingSort] = useState<boolean | undefined>(undefined)
    const dispatch = useDispatch()

    return <div
        className={`${styles.title} ${styles.row} ${test ? styles["ebay-grid"] : styles["ebay-grid-collapsed"]}`}>
        <div>Price</div>
        {test ? <MarginTestTitle/> : null}
        <div onClick={() => {
            dispatch(sortMarginData({channel:"ebay", key: "profit", ascending: ascendingSort}))
            ascendingSort === undefined ? setAscendingSort(false) : setAscendingSort(!ascendingSort)
        }}>Ebay Margin {currentSort !== "ebay-profit" ? "--" : ascendingSort ? "▲" : "▼"}</div>
    </div>
}