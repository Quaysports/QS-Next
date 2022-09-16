import React, {useState, useEffect} from "react";
import UpdateIncorrectStock from "./update-incorrect-stock-function"
import ZeroStockList from "./zero-stock-list-function";
import IncorrectStockList from "./incorrect-stock-list-function";
import styles from './incorrect-stock-list.module.css'
import {appWrapper} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {getIncorrectStock} from "../../server-modules/shop/shop"
import {
    selectIncorrectStockState, selectValidData, selectZeroStockState,
    setIncorrectStockInitialState,
    setValidData,
    setZeroStockInitialState,
} from "../../store/incorrect-stock-slice";
import {setMenuOptions} from "../../store/menu-slice";
import Menu from "../../components/menu/menu";

export default function IncorrectStockLandingPage() {

    const dispatch = useDispatch()

    const [refreshData, setRefreshData] = useState<boolean>(false);
    const incorrectStockState = useSelector(selectIncorrectStockState);
    const zeroStockState = useSelector(selectZeroStockState);
    const validDataState = useSelector(selectValidData)

    useEffect(() => {
        //props.titleBar([])
    }, [])

    function pageRerenderHandler() {
        setRefreshData(!refreshData)
    }

    function validDataHandler(boolean) {
        dispatch(setValidData(boolean))
    }

    return (
        <div>
            <Menu/>
            <div id={styles.incorrectStockListContainer}>
                <div className={styles.titles}>HIGH PRIORITY ITEMS TO CHECK
                    <button onClick={() => {
                        UpdateIncorrectStock(pageRerenderHandler, incorrectStockState, zeroStockState, validDataState, dispatch)
                    }}
                            id={styles.saveButton}>Save
                    </button>
                </div>
                <div className={styles.stockListsTitles}>
                    <span/>
                    <span>SKU</span>
                    <span>Title</span>
                    <span className={styles.stockCheckedTitles}>Stock</span>
                    <span className={styles.stockCheckedTitles}>Checked</span>
                </div>
                <div><IncorrectStockList
                    validDataHandler={(x: boolean) => validDataHandler(x)}
                /></div>
                <div
                    className={styles.titles}>--------------------------------------------------------------------------------------
                </div>
                <div className={styles.titles}>LOW PRIORITY ITEMS TO CHECK</div>
                <div className={styles.stockListsTitles}>
                    <span/>
                    <span>SKU</span>
                    <span>Title</span>
                    <span className={styles.stockCheckedTitles}>Stock</span>
                    <span className={styles.stockCheckedTitles}>Checked</span>
                </div>
                <div><ZeroStockList
                    validDataHandler={(x: boolean) => validDataHandler(x)}
                /></div>
            </div>
        </div>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async (context) => {
            const data = JSON.parse(JSON.stringify(await getIncorrectStock()))
            let priorityObject = {}
            let tempObject = {}
            for (let i = 0; i < data.length; i++) {
                if (data[i].PRIORITY) {
                    priorityObject[data[i].BRAND] ??= []
                    priorityObject[data[i].BRAND].push(data[i])
                } else {
                    tempObject[data[i].BRAND] ??= []
                    tempObject[data[i].BRAND].push(data[i])
                }
            }
            store.dispatch(setIncorrectStockInitialState(priorityObject))
            store.dispatch(setZeroStockInitialState(tempObject))
            store.dispatch(setMenuOptions({}))
            return void {}
        }
)