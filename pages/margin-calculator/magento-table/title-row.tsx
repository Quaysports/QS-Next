import {useDispatch, useSelector} from "react-redux";
import {selectCurrentSort, sortMarginData} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import styles from "../margin-calculator.module.css";

export default function TitleRow(){
    const currentSort = useSelector(selectCurrentSort)
    const [ascendingSort, setAscendingSort] = useState<boolean | undefined>(undefined)
    const dispatch = useDispatch()

    return <div className={`${styles.title} ${styles.row} ${styles["magento-grid"]}`}>
        <div>QS Price</div>
        <div  onClick={()=>{
            dispatch(sortMarginData({key:"QSPAVC", ascending:ascendingSort}))
            ascendingSort === undefined ? setAscendingSort(false) : setAscendingSort(!ascendingSort)
        }}>QS Margin  {currentSort !== "QSPAVC" ? "--" : ascendingSort ? "▲" : "▼"}</div>
    </div>
}