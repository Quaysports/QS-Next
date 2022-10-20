import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import styles from "../shop-orders.module.css";
import {
    selectRadioButtons, selectRenderedArray, selectSupplierItems,
    selectThreshold, setChangeOrderArray, setInputChange,
    setThreshold
} from "../../../store/shop-orders-slice";
import {Fragment} from "react";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

export default function BuildStockList() {

    const supplierItems = useSelector(selectSupplierItems)
    const radioButtons = useSelector(selectRadioButtons)
    const renderedArray = useSelector(selectRenderedArray)
    const threshold = useSelector(selectThreshold)
    const dispatch = useDispatch()

    function buildListRow(item: orderObject, index: number, allItems: boolean) {
        let tempArray = []
        tempArray.push(
            <div key={item.SKU}
                 className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["new-order-list-grid"]}`}
                 style={item.onOrder ? {backgroundColor: "var(--traffic-light-orange)"} : undefined}>
                <button onClick={() => {
                    addToOrderHandler(item)
                }}>⇅
                </button>
                <span className={"center-align"}>{item.STOCKTOTAL} </span>
                <span className={"center-align"}>{item.MINSTOCK} </span>
                <span>{item.SKU} </span>
                <span>{item.TITLE} </span>
                <input defaultValue={renderedArray[index].qty} onChange={(e) => {
                    inputChangeHandler(e.target.value, "qty", index)
                }}/>
                <input defaultValue={renderedArray[index].tradePack} onChange={(e) => {
                    inputChangeHandler(e.target.value, "tradePack", index)
                }}/>
                <span className={"center-align"}>£{item.PURCHASEPRICE.toFixed(2)}</span>
                <span className={styles["dead-stock-image-parent"]}>{item.deadStock ? imageCheck(item) : null}
                    </span>
            </div>
        )
        if (allItems) {
            tempArray.push(<button key={item.SKU + "button"} onClick={() => {
                dispatch(setThreshold((threshold + 50)));
            }}>Load more items</button>)
        }
        return <Fragment key={item.SKU + 10}>{tempArray}</Fragment>
    }

    function inputChangeHandler(value: string, key: string, index: number) {
        dispatch(setInputChange({key: key, index: index, value: value}))
    }

    function addToOrderHandler(item: orderObject) {
        let renderedArrayIndex = renderedArray.findIndex(product => product.SKU === item.SKU)
        let fullStockIndex = supplierItems.findIndex(product => product.SKU === item.SKU)

        if (radioButtons.allItems) {
            dispatch(setChangeOrderArray({item: renderedArray[renderedArrayIndex], type: "add", index: fullStockIndex}))
        }
        if (radioButtons.lowStock) {
            dispatch(setChangeOrderArray({item: renderedArray[renderedArrayIndex], type: "add", index: fullStockIndex}))
        }
    }

    function imageCheck(item: orderObject) {
        switch (item.SOLDFLAG) {
            case 3:
                return (<Image onMouseOver={(e) => dispatchNotification({type: "tooltip", content:"Not sold for between 3-6 months", e:e})} onMouseLeave={() => dispatchNotification({type: undefined})}
                               src="/dead-stock-icon-green.webp" width="22px" height="22px"
                               alt={"None sold for between 3-6 months"}/>)
            case 6:
                return (<Image onMouseOver={(e) => dispatchNotification({type: "tooltip", content: "Not sold for between 6-10 months", e:e})} onMouseLeave={() => dispatchNotification({type: undefined})}
                               src="/dead-stock-icon-orange.webp" width="22px" height="22px"
                               alt={"None sold for between 6-10 months"}/>)
            case 10:
                return (<Image onMouseOver={(e) => dispatchNotification({type: "tooltip", content: "Not sold for over 10 months", e:e})} onMouseLeave={() => dispatchNotification({type: undefined})}
                               src="/dead-stock-icon-red.webp" width="22px" height="22px"
                               alt={"None sold for over 10 months"}/>)
        }
    }

    let tempArray = []
    for (let i = 0; i < renderedArray.length; i++) {
        let allItems = false
        if (i === threshold && i < renderedArray.length) allItems = true
        tempArray.push(buildListRow(renderedArray[i], i, allItems))

        if (i === threshold) break
    }

    return <>{tempArray}</>
}