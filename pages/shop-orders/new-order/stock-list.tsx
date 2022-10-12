import * as React from 'react';
import {Fragment, useEffect, useState} from "react";
import SearchBar, {SearchItem} from "../../../components/search-bar/index";
import Image from "next/image";
import {
    orderObject,
    selectLowStockArray,
    selectRadioButtons,
    selectRenderedArray,
    selectSupplierItems,
    selectThreshold,
    setChangeOrderArray,
    setInputChange,
    setLowStockArray,
    setRadioButtons,
    setRenderedArray,
    setThreshold
} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";
import styles from '../shop-orders.module.css'


/**
 * Stock List Component
 */
export default function StockList() {

    const dispatch = useDispatch()
    const threshold = useSelector(selectThreshold)
    const radioButtons = useSelector(selectRadioButtons)
    const supplierItems = useSelector(selectSupplierItems)
    const lowStockArray = useSelector(selectLowStockArray)
    const renderedArray = useSelector(selectRenderedArray)
    const [rerender, setRerender] = useState<boolean>(false)
    const [searchableArray, setSearchableArray] = useState<orderObject[]>([])

    useEffect(() => {
        let tempArray:orderObject[] = []
        supplierItems.forEach((value) => {
            if (value.lowStock) tempArray.push(value)
        })
        dispatch(setLowStockArray(tempArray))
        if (radioButtons.lowStock) {
            dispatch(setRenderedArray(tempArray))
            setSearchableArray(tempArray)
        } else {
            dispatch(setRenderedArray(supplierItems))
            setSearchableArray(supplierItems)
        }
    }, [supplierItems, rerender])

    function radioButtonsHandler(checked: boolean, box: string) {
        if (box === "lowStock" && checked) {
            dispatch(setRadioButtons({lowStock: true, allItems: false}))
            dispatch(setRenderedArray(lowStockArray))
            dispatch(setThreshold(50))
            setRerender(!rerender)
        }
        if (box === "allItems" && checked) {
            dispatch(setRadioButtons({lowStock: false, allItems: true}))
            dispatch(setRenderedArray(supplierItems))
            dispatch(setThreshold(50))
            setRerender(!rerender)
        }
    }

    function inputChangeHandler(value: string, key: string, index:number) {
        dispatch(setInputChange({key: key, index: index, value: value}))
    }

    function addToOrderHandler(item: orderObject) {
        let fullStockIndex = supplierItems.findIndex(product => product.SKU === item.SKU)
        if (radioButtons.allItems) {
            dispatch(setChangeOrderArray({type: "add", index: fullStockIndex}))
        }
        if (radioButtons.lowStock) {
            dispatch(setChangeOrderArray({type: "add", index: fullStockIndex}))
        }
    }

    function imageCheck(item: orderObject) {
        switch (item.SOLDFLAG) {
            case 3:
                return (<Image src="/dead-stock-icon-green.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)

            case 6:
                return (<Image src="/dead-stock-icon-orange.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)

            case 10:
                return (<Image src="/dead-stock-icon-red.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)
        }

    }

    function buildListRow(item: orderObject, index: number, allItems: boolean) {
        let tempArray = []
        tempArray.push(
            <div key={item.SKU}
                 className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["low-stock-list-grid"]}`}>
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

    function buildList() {
        let tempArray = []
        for (let i = 0; i < renderedArray.length; i++) {
            let allItems = false
            if (i === threshold && i < renderedArray.length) allItems = true
            tempArray.push(buildListRow(renderedArray[i], i, allItems))

            if (i === threshold) break
        }
        return <>{tempArray}</>
    }

    function buildSearchBar() {
        if (radioButtons.allItems) {
            return <SearchBar resultHandler={(x) => setNewRenderedArray(x)} EAN={false} searchableArray={searchableArray}/>
        }
        if (radioButtons.lowStock) {
            return <SearchBar resultHandler={(x) => setNewRenderedArray(x)} EAN={false} searchableArray={searchableArray}/>
        }
        return null
    }

    function setNewRenderedArray(filteredArray: SearchItem[]) {
        dispatch(setThreshold(50))
        dispatch(setRenderedArray(filteredArray as orderObject[]))
    }

    return (
        <div className={styles["shop-orders-table-containers"]} id={styles["stock-list-table"]}>
            <div className={styles["table-title-container"]}>
                <span>Low Stock List</span>
                <span className={styles["primary-buttons"]}>
                        <label htmlFor={"low-Stock"}>Low Stock</label><input type={"radio"}
                                                                             checked={radioButtons.lowStock}
                                                                             id={"low-Stock"} name="display-toggle"
                                                                             onChange={(e) => radioButtonsHandler(e.target.checked, "lowStock")}/>
                    <label htmlFor={"all-items"}>All Items</label><input type={"radio"} checked={radioButtons.allItems}
                                                                         id={"all-items"} name="display-toggle"
                                                                         onChange={(e) => radioButtonsHandler(e.target.checked, "allItems")}/></span>
            </div>
            <div className={styles["search-bar-wrapper"]}>{buildSearchBar()}</div>
            <div className={`${styles["shop-orders-table"]} ${styles["low-stock-list-grid"]}`}>
                <span/>
                <span className={"center-align"}>Stock</span>
                <span className={"center-align"}>Min</span>
                <span>SKU</span>
                <span>Title</span>
                <span>Order</span>
                <span className={"center-align"}>T/P Size</span>
                <span className={"center-align"}>P/Price</span>
                <span/>
            </div>
            <div>
                {buildList()}
            </div>
        </div>
    );

}