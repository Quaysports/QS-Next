import * as React from "react";
import styles from './incorrect-stock-list.module.css'
import {
    selectIncorrectStockState, setIncorrectStockChecked,
    setIncorrectStockQty, setValidData
} from "../../../store/stock-reports-slice";
import {useDispatch, useSelector} from "react-redux";
import {StockError} from "../../../server-modules/shop/shop";

/**
 * Incorrect Stock List Component
 * Dynamically builds the rows and inputs the SKU, Title and input boxes for each item in the incorrect stock list
 */

export default function IncorrectStockList() {

    const incorrectStockState = useSelector(selectIncorrectStockState);
    const dispatch = useDispatch()

    let incorrectStockArray:JSX.Element[] = []

    for(const brand in incorrectStockState){
        let key = brand
        let values = incorrectStockState[brand]
        incorrectStockArray.push(
            <div key={key} data-testid={"incorrect-list-wrapper"}>
                <div className={styles["brand-titles"]}>
                    <div data-testid={"incorrect-list-brand"}>{key !== "undefined" ? key : "Unbranded"}</div>
                </div>
                {values.map((item: StockError, index: number) => {
                    return (
                        <div className={styles["stock-lists"]} key={index}>
                            <span/>
                            <span data-testid={"incorrect-list-SKU"}>{item.SKU}</span>
                            <span data-testid={"incorrect-list-title"}>{item.TITLE}</span>
                            <input className={styles["stock-lists-input"]}
                                   defaultValue={incorrectStockState[key][index].QTY | 0}
                                   onChange={(e) => {
                                       if (e.target.validity.patternMismatch) {
                                           e.target.style.borderColor = "var(--secondary-color)"
                                           e.target.reportValidity()
                                           dispatch(setValidData(false))
                                       }
                                       if (!e.target.validity.patternMismatch) {
                                           let value = e.target.value
                                           if (value === "") value = "0"
                                           dispatch(setIncorrectStockQty({
                                               payload: parseInt(value),
                                               brand: key,
                                               location: index
                                           }))
                                           e.target.style.borderColor = ""
                                           dispatch(setValidData(true))
                                       }
                                   }
                                   }
                                   pattern="^[0-9]+$"
                            />
                            <input
                                type={"checkbox"}
                                defaultChecked={false}
                                onChange={(e) => dispatch(setIncorrectStockChecked({
                                    payload: e.target.checked,
                                    brand: key,
                                    location: index
                                }))}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }
    return <>{incorrectStockArray}</>
}