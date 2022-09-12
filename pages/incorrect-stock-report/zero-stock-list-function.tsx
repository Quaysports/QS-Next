import * as React from "react";
import styles from './incorrect-stock-list-css.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    IncorrectStockItem,
    selectZeroStockState, setZeroStockChecked, setZeroStockQty
} from "../../store/incorrect-stock-slice";


export default function ZeroStockList(validDataHandler) {

    const zeroStockState = useSelector(selectZeroStockState);
    const dispatch = useDispatch()

    let zeroStockArray:JSX.Element[] = []

    for (const brand in zeroStockState) {
        let key = brand
        let values = zeroStockState[brand]
        zeroStockArray.push(
            <div key={key}>
                <div className={styles.brandTitles}>
                    <div>{key !== "undefined" ? key:"Unbranded"}</div>
                </div>
                <div>
                    {values.map((item: IncorrectStockItem, index: number) => {
                        return (
                            <div className={styles.stockLists} key={index}>
                                <span/>
                                <span>{item.SKU} </span>
                                <span>{item.TITLE} </span>
                                <input className={`${styles.stockListsInput} ${styles.stockListsCells}`}
                                       onChange={(e) =>
                                       {
                                           if(e.target.validity.patternMismatch){
                                               e.target.style.borderColor = "var(--secondary-color)"
                                               e.target.reportValidity()
                                               validDataHandler(false)
                                           }
                                           if(!e.target.validity.patternMismatch){
                                               dispatch(setZeroStockQty({payload:parseInt(e.target.value), brand: key, location:index}))
                                               e.target.style.borderColor = ""
                                               validDataHandler(true)
                                           }
                                       }}
                                       pattern="^[0-9]+$"
                                />
                                <input
                                    type={"checkbox"}
                                    onChange={(e) => dispatch(setZeroStockChecked({payload: e.target.checked, brand: key, location:index}))}

                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    return <>{zeroStockArray}</>
}