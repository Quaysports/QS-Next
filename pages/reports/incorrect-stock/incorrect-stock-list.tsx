import * as React from "react";
import styles from './incorrect-stock-list.module.css'
import {
    selectIncorrectStockState, setIncorrectStockChecked,
    setIncorrectStockQty, setValidData
} from "../../../store/reports/stock-reports-slice";
import {useDispatch, useSelector} from "react-redux";
import {StockError} from "../../../server-modules/shop/shop";

/**
 * Incorrect Stock List Component
 * Dynamically builds the rows and inputs the SKU, Title and input boxes for each item in the incorrect stock list
 */

export default function IncorrectStockList() {

    const incorrectStockState = useSelector(selectIncorrectStockState);
    let incorrectStockArray:JSX.Element[] = []

    for(const brand in incorrectStockState){

        let rows = []
        for(const [k,v] of Object.entries(incorrectStockState[brand])){
            rows.push(<Row key={k} item={v} index={Number(k)} brand={brand}/>)
        }

        incorrectStockArray.push(<div key={brand} data-testid={"incorrect-list-wrapper"}>
            <TitleRow key={brand} brand={brand}/>{rows}
        </div>)
    }
    return <>{incorrectStockArray}</>
}

function TitleRow({brand}:{brand:string}){
    return <div className={styles["brand-titles"]}>
        <div data-testid={"incorrect-list-brand"}>{brand !== "undefined" ? brand : "Unbranded"}</div>
    </div>
}

function Row({item,index,brand}:{item: StockError, index: number,brand:string}){
    const dispatch = useDispatch()

    return(
        <div className={styles["stock-lists"]} key={index}>
            <span/>
            <span data-testid={"incorrect-list-SKU"}>{item.SKU}</span>
            <span data-testid={"incorrect-list-title"}>{item.title}</span>
            <input className={styles["stock-lists-input"]}
                   defaultValue={item.quantity | 0}
                   onChange={(e) => {
                       if (e.target.validity.patternMismatch) {
                           e.target.style.borderColor = "var(--secondary-color)"
                           e.target.reportValidity()
                           dispatch(setValidData(false))
                       } else {
                           let value = e.target.value
                           if (value === "") value = "0"
                           dispatch(setIncorrectStockQty({
                               payload: parseInt(value),
                               brand: brand,
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
                checked={item.checked}
                onChange={(e) => dispatch(setIncorrectStockChecked({
                    payload: e.target.checked,
                    brand: brand,
                    location: index
                }))}
            />
        </div>)
}