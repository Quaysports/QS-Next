import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import styles from "../shop-orders.module.css";
import {
    selectRadioButtons, selectRenderedArray, selectSupplierItems,
    selectThreshold, setChangeOrderArray, setQuantity,
    setThreshold
} from "../../../store/shop-orders-slice";
import {Fragment} from "react";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrencyInput} from "../../../components/margin-calculator-utils/utils";
import TradePackPopup from "./trade-pack-popup";

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
                 style={item.onOrder ? {backgroundColor: "var(--traffic-light-orange)", color:"black"} : undefined}>
                <button onClick={() => {
                    addToOrderHandler(item)
                }}>⇅
                </button>
                <span className={"center-align"}>{item.stock.total} </span>
                <span className={"center-align"}>{item.stock.minimum} </span>
                <span>{item.SKU} </span>
                <span>{item.title} </span>
                <input defaultValue={renderedArray[index].quantity} onChange={(e) => {
                    inputChangeHandler(e.target.value, index)
                }}/>
                <div className={"center-align"} onClick={() => { dispatchNotification({type:'popup', title:'Trade pack amount', content:<TradePackPopup index={index}/>})}}
                >{renderedArray[index].stock.tradePack ?? "None"}</div>
                <span className={"center-align"}>{toCurrencyInput(item.prices.purchase)}</span>
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

    function inputChangeHandler(value: string, index: number) {
        dispatch(setQuantity({index: index, value: value}))
    }

    function addToOrderHandler(item: orderObject) {
        if(!item.stock.tradePack) {
            dispatchNotification({type:'alert', title:'No trade pack size', content:"Please increase trade pack size"})
        } else {
            let renderedArrayIndex = renderedArray.findIndex(product => product.SKU === item.SKU)
            let fullStockIndex = supplierItems.findIndex(product => product.SKU === item.SKU)

            if (radioButtons.allItems) {
                dispatch(setChangeOrderArray({renderedIndex: renderedArrayIndex, type: "add", fullStockIndex: fullStockIndex}))
            }
            if (radioButtons.lowStock) {
                dispatch(setChangeOrderArray({renderedIndex: renderedArrayIndex, type: "add", fullStockIndex: fullStockIndex}))
            }
        }
    }

    function imageCheck(item: orderObject) {
        switch (item.soldFlag) {
            case 3:
                return (
                    <Image
                        onMouseOver={(e) => dispatchNotification({type: "tooltip", content:"Not sold for between 3-6 months", e:e})}
                        onMouseLeave={() => dispatchNotification()}
                        src="/dead-stock-icon-green.webp"
                        width="22"
                        height="22"
                        alt={"None sold for between 3-6 months"}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                );
            case 6:
                return (
                    <Image
                        onMouseOver={(e) => dispatchNotification({type: "tooltip", content: "Not sold for between 6-10 months", e:e})}
                        onMouseLeave={() => dispatchNotification()}
                        src="/dead-stock-icon-orange.webp"
                        width="22"
                        height="22"
                        alt={"None sold for between 6-10 months"}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                );
            case 10:
                return (
                    <Image
                        onMouseOver={(e) => dispatchNotification({type: "tooltip", content: "Not sold for over 10 months", e:e})}
                        onMouseLeave={() => dispatchNotification()}
                        src="/dead-stock-icon-red.webp"
                        width="22"
                        height="22"
                        alt={"None sold for over 10 months"}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                );
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