import * as React from "react";
import styles from './incorrect-stock-list.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    selectZeroStockState, setValidData, setZeroStockChecked, setZeroStockQty
} from "../../../store/reports/stock-reports-slice";
import {StockError} from "../../../server-modules/shop/shop";

/**
 * Zero Stock List Component
 * Dynamically builds the rows and inputs the SKU, Title and input boxes for each item in the zero stock list
 */
export default function ZeroStockList() {

    const zeroStockState = useSelector(selectZeroStockState);
    let zeroStockArray: JSX.Element[] = []

    for (const brand in zeroStockState) {
        let values = zeroStockState[brand]
        let rows = []
        for (let [k, v] of Object.entries(values)) {
            rows.push(<Row key={k} brand={brand} index={Number(k)} item={v}/>)
        }
        zeroStockArray.push(
            <div key={brand} data-testid={"zero-list-wrapper"}>
                <TitleRow key={brand} brand={brand}/>
                {rows}
            </div>
        )
    }
    return <>{zeroStockArray}</>
}

function TitleRow({brand}: { brand: string }) {
    return <div className={styles["brand-titles"]}>
        <div data-testid={"zero-list-brand"}>{brand !== "undefined" ? brand : "Unbranded"}</div>
    </div>
}

function Row({index, item, brand}:{index:number, item:StockError, brand:string}) {
    const dispatch = useDispatch()

    return <div className={styles["stock-lists"]} key={index}>
        <span/>
        <span data-testid={"zero-list-SKU"}>{item.SKU}</span>
        <span data-testid={"zero-list-title"}>{item.title}</span>
        <input className={`${styles["stock-lists-input"]} ${styles["stock-lists-cells"]}`}
               onChange={(e) => {
                   if (e.target.validity.patternMismatch) {
                       e.target.style.borderColor = "var(--secondary-color)"
                       e.target.reportValidity()
                       dispatch(setValidData(false))
                   }
                   if (!e.target.validity.patternMismatch) {
                       dispatch(setZeroStockQty({payload: parseInt(e.target.value), brand: brand, location: index}))
                       e.target.style.borderColor = ""
                       dispatch(setValidData(true))
                   }
               }}
               pattern="^[0-9]+$"
        />
        <input
            type={"checkbox"}
            onChange={(e) => dispatch(setZeroStockChecked({payload: e.target.checked, brand: brand, location: index}))}

        />
    </div>
}