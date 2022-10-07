import styles from "./incorrect-stock-list.module.css";
import UpdateIncorrectStock from "./update-incorrect-stock-function";
import ZeroStockList from "./zero-stock-list";
import React,{Fragment} from "react";
import IncorrectStockList from "./incorrect-stock-list";

/**
 * Incorrect Stock Tab
 * Builds title bars for the incorrect stock page and calls components
 */
export default function IncorrectStock(){

    return(
        <Fragment>
            <div className={styles["titles"]}>HIGH PRIORITY ITEMS TO CHECK
                <UpdateIncorrectStock />
            </div>
            <div className={styles["stock-lists-titles"]}>
                <span/>
                <span>SKU</span>
                <span>Title</span>
                <span className={styles["stock-checked-titles"]}>Stock</span>
                <span className={styles["stock-checked-titles"]}>Checked</span>
            </div>
            <div data-testid={"incorrect-list-div"}>
                <IncorrectStockList/>
            </div>
            <div className={styles["titles"]}>
                --------------------------------------------------------------------------------------
            </div>
            <div className={styles["titles"]}>LOW PRIORITY ITEMS TO CHECK</div>
            <div className={styles["stock-lists-titles"]}>
                <span/>
                <span>SKU</span>
                <span>Title</span>
                <span className={styles["stock-checked-titles"]}>Stock</span>
                <span className={styles["stock-checked-titles"]}>Checked</span>
            </div>
            <div>
                <ZeroStockList/>
            </div>
        </Fragment>
    )
}