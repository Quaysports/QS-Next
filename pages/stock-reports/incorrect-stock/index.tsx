import styles from "./incorrect-stock-list.module.css";
import UpdateIncorrectStock from "./update-incorrect-stock-function";
import ZeroStockList from "./zero-stock-list-function";
import React from "react";
import {useDispatch} from "react-redux";
import {setValidData} from "../../../store/incorrect-stock-slice";
import IncorrectStockList from "./incorrect-stock-list-function";

export default function IncorrectStock(){

    const dispatch = useDispatch()
    const validDataHandler = (boolean) => dispatch(setValidData(boolean))

    return(
        <>
            <div className={styles.titles}>HIGH PRIORITY ITEMS TO CHECK
                <UpdateIncorrectStock />
            </div>
            <div className={styles.stockListsTitles}>
                <span/>
                <span>SKU</span>
                <span>Title</span>
                <span className={styles.stockCheckedTitles}>Stock</span>
                <span className={styles.stockCheckedTitles}>Checked</span>
            </div>
            <div>
                <IncorrectStockList/>
            </div>
            <div className={styles.titles}>
                --------------------------------------------------------------------------------------
            </div>
            <div className={styles.titles}>LOW PRIORITY ITEMS TO CHECK</div>
            <div className={styles.stockListsTitles}>
                <span/>
                <span>SKU</span>
                <span>Title</span>
                <span className={styles.stockCheckedTitles}>Stock</span>
                <span className={styles.stockCheckedTitles}>Checked</span>
            </div>
            <div>
                <ZeroStockList validDataHandler={(x: boolean) => validDataHandler(x)}/>
            </div>
        </>
    )
}