import {useDispatch, useSelector} from "react-redux";
import {selectCurrentSort, sortMarginData} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import styles from "../margin-calculator.module.css";
import {useRouter} from "next/router";

export default function TitleRow(){

    const router = useRouter()
    const domestic = router.query.domestic === "true"
    const currentSort = useSelector(selectCurrentSort)
    const [ascendingSort, setAscendingSort] = useState<boolean | undefined>(undefined)
    const dispatch = useDispatch()

    return <div className={`${styles.title} ${styles.row} ${domestic ? styles["magento-grid-discount"] : styles["magento-grid"]}`}>
        {domestic ? <div>Discount %</div> : null}
        {domestic ? <div>Discount</div> : null}
        <div>Price</div>
        <div  onClick={()=>{
            dispatch(sortMarginData({key:"magentoProfitAfterVat", ascending:ascendingSort}))
            ascendingSort === undefined ? setAscendingSort(false) : setAscendingSort(!ascendingSort)
        }}>QS Margin  {currentSort !== "magentoProfitAfterVat" ? "--" : ascendingSort ? "▲" : "▼"}</div>
    </div>
}