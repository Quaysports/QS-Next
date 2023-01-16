import {useDispatch, useSelector} from "react-redux";
import {selectCurrentSort, sortMarginData} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import styles from "../margin-calculator.module.css";

export default function TitleRow(){

    const currentSort = useSelector(selectCurrentSort)
    const [ascendingSort, setAscendingSort] = useState<boolean | undefined>(undefined)
    const dispatch = useDispatch()

    return <div className={`${styles.title} ${styles.row} ${styles["shop-grid"]}`}>
        <div>Discount %</div>
        <div>Discount</div>
        <div>Price</div>
        <div  onClick={()=>{
            dispatch(sortMarginData({channel:"shop", key:"profit", ascending:ascendingSort}))
            ascendingSort === undefined ? setAscendingSort(false) : setAscendingSort(!ascendingSort)
        }}>Shop Margin  {currentSort !== "shop-profit" ? "--" : ascendingSort ? "▲" : "▼"}</div>
    </div>
}