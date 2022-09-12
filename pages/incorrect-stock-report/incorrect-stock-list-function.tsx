import * as React from "react";
import styles from './incorrect-stock-list-css.module.css'
import {
    IncorrectStockItem,
    selectIncorrectStockState, setIncorrectStockChecked,
    setIncorrectStockQty, setValidData
} from "../../store/incorrect-stock-slice";
import {useDispatch, useSelector} from "react-redux";

export default function IncorrectStockList(validDataHandler) {

    const incorrectStockState = useSelector(selectIncorrectStockState);
    const dispatch = useDispatch()

    let incorrectStockArray:JSX.Element[] = []

    for(const brand in incorrectStockState){
        let key = brand
        let values = incorrectStockState[brand]
        incorrectStockArray.push(
            <div key={key}>
                    <div className={styles.brandTitles}>
                        <div>{key !== "undefined" ? key:"Unbranded"}</div>
                    </div>
                    {values.map((item: IncorrectStockItem, index: number) => {
                        return (
                            <div className={styles.stockLists} key={index}>
                                <span/>
                                <span className="stock-lists-cells">{item.SKU} </span>
                                <span className="stock-lists-cells">{item.TITLE} </span>
                                <input className={`${styles.stockListsInput} ${styles.stockListsCells}`}
                                       value={incorrectStockState[key][index].QTY | 0}
                                       onChange={(e) => {
                                           if (e.target.validity.patternMismatch) {
                                               e.target.style.borderColor = "var(--secondary-color)"
                                               e.target.reportValidity()
                                               dispatch(setValidData(false))
                                           }
                                           if (!e.target.validity.patternMismatch) {
                                               let value = e.target.value
                                               console.log(value)
                                               if (value === "") value = "0"
                                               dispatch(setIncorrectStockQty({payload:parseInt(value), brand: key, location:index}))
                                               console.log(incorrectStockState[key][index])
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
                                    onChange={(e) => dispatch(setIncorrectStockChecked({payload: e.target.checked, brand: key, location:index}))}
                                />
                            </div>
                        )
                    })}
            </div>
        )
    }

    return <>{incorrectStockArray}</>
}