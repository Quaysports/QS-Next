import {useDispatch, useSelector} from "react-redux";
import {selectCurrentSort, sortMarginData} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import styles from "../margin-calculator.module.css";
import Image from "next/image";
import {MarginTestTitle} from "./margin-test-results";

export default function TitleRow({displayTest}: { displayTest: boolean }) {
    const currentSort = useSelector(selectCurrentSort)
    const [ascendingSort, setAscendingSort] = useState<boolean | undefined>(undefined)
    const dispatch = useDispatch()

    return <div
        className={`${styles.title} ${styles.row} ${displayTest ? styles["amazon-grid"] : styles["amazon-grid-collapsed"]}`}>
        <div>Price</div>
        {displayTest ? <MarginTestTitle /> : null}
        <div onClick={() => {
            dispatch(sortMarginData({key: "amazonPrimeProfitAfterVat", ascending: ascendingSort}))
            ascendingSort === undefined ? setAscendingSort(false) : setAscendingSort(!ascendingSort)
        }}>Amz Margin {currentSort !== "AMAZPAVC" ? "--" : ascendingSort ? "▲" : "▼"}</div>
        <div>
            <Image alt={"prime"} src={"/prime-logo.svg"} width={"20"} height={"20"}/>
        </div>
        <div onClick={() => {
            dispatch(sortMarginData({key: "amazonPrimeProfitAfterVat", ascending: ascendingSort}))
            ascendingSort === undefined ? setAscendingSort(false) : setAscendingSort(!ascendingSort)
        }}>Prime Margin {currentSort !== "PRIMEPAVC" ? "--" : ascendingSort ? "▲" : "▼"}</div>
    </div>
}