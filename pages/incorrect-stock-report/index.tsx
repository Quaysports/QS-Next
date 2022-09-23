import React, {useEffect} from "react";
import UpdateIncorrectStock from "./update-incorrect-stock-function"
import ZeroStockList from "./zero-stock-list-function";
import IncorrectStockList from "./incorrect-stock-list-function";
import styles from './incorrect-stock-list.module.css'
import {useDispatch} from "react-redux";
import {getIncorrectStock} from "../../server-modules/shop/shop"
import {
    setIncorrectStockInitialState,
    setValidData,
    setZeroStockInitialState,
} from "../../store/incorrect-stock-slice";
import Menu from "../../components/menu/menu";

export default function IncorrectStockLandingPage({incorrectStock, zeroStock}) {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIncorrectStockInitialState(incorrectStock))
        dispatch(setZeroStockInitialState(zeroStock))
    }, [])


    function validDataHandler(boolean) {
        dispatch(setValidData(boolean))
    }

    return (
        <div>
            <Menu/>
            <div id={styles.incorrectStockListContainer}>
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
                    <IncorrectStockList validDataHandler={(x: boolean) => validDataHandler(x)}/>
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
            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const data = JSON.parse(JSON.stringify(await getIncorrectStock()))
    let incorrectStock = {}
    let zeroStock = {}
    for (let i = 0; i < data.length; i++) {
        if (data[i].PRIORITY) {
            incorrectStock[data[i].BRAND] ??= []
            incorrectStock[data[i].BRAND].push(data[i])
        } else {
            zeroStock[data[i].BRAND] ??= []
            zeroStock[data[i].BRAND].push(data[i])
        }
    }

    return {props: {incorrectStock: incorrectStock, zeroStock: zeroStock}}
}

