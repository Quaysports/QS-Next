import {
    selectIncorrectStockState, selectValidData, selectZeroStockState,
    setIncorrectStockSplice,
    setZeroStockSplice
} from "../../../store/stock-reports-slice";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import styles from "./incorrect-stock-list.module.css";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

/**
 * Update Incorrect Stock Component
 * Builds the button and contains all the functionality to update stock on linnworks and cleans out the Mongo collection
 */

export default function UpdateIncorrectStock() {
    const dispatch = useDispatch()

    const incorrectStockState = useSelector(selectIncorrectStockState);
    const zeroStockState = useSelector(selectZeroStockState);
    const validDataState = useSelector(selectValidData)

    const runUpdate = ()=> {
        if (validDataState) {
            let tempArray = []
            for (const brand in zeroStockState) {
                for (let i = 0; i < zeroStockState[brand].length; i++) {
                    if (zeroStockState[brand][i].CHECKED) {
                        tempArray.push(zeroStockState[brand][i])
                        dispatch(setZeroStockSplice({brand: brand, index: i, amount: 1}))
                    }
                }
            }
            for (const brand in incorrectStockState) {
                for (let i = 0; i < incorrectStockState[brand].length; i++) {
                    if (incorrectStockState[brand][i].CHECKED) {
                        tempArray.push(incorrectStockState[brand][i])
                        dispatch(setIncorrectStockSplice({brand: brand, index: i, amount: 1}))
                    }
                }
            }
            const opts = {
                method: "POST",
                headers: {
                    'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({updateId: "StockAdjust - " + date(), data: tempArray})
            }
            fetch("/api/incorrect-stock/incorrect-stock-adjust-and-mongo-clean-up", opts)
                .then(res => res.json())
                .then(res => {
                     if(res.acknowledged) {
                         dispatchNotification({
                             type: "alert",
                             title: "Stock Update",
                             content: `${res.deletedCount} items updated`
                         })
                     } else {
                         dispatchNotification({
                             type: "alert",
                             title: "Stock Update",
                             content: `Update failed, please contact IT`
                         })
                     }
                })
        } else {
            dispatchNotification({type: "alert", title: "Error", content: "Please enter only numbers in stock levels"})
        }
    }

    function date() {
        const date = new Date();
        return (`${ date.getDay() }/${ date.getMonth() + 1 }/${ date.getFullYear() }`)
    }

    return (
        <button
            onClick={() => runUpdate()}
            id={styles["save-button"]}>Save
        </button>
    )
}