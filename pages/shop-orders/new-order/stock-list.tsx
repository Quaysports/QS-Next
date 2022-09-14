import * as React from 'react';
import {item} from "../index";
import {Fragment, useEffect, useState} from "react";
import SearchBar from "../../../components/search-bar/index";
import Image from "next/image";
import {
    orderObject, selectLowStockArray,
    selectRadioButtons, selectRenderedArray,
    selectSupplierFilter, selectSupplierItems,
    selectThreshold, setChangeOrderArray, setInputChange, setLowStockArray, setRadioButtons, setRenderedArray,
    setThreshold
} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";

export default function StockList() {

    const dispatch = useDispatch()
    const threshold = useSelector(selectThreshold)
    const radioButtons = useSelector(selectRadioButtons)
    const supplier = useSelector(selectSupplierFilter)
    const supplierItems = useSelector(selectSupplierItems)
    const lowStockArray = useSelector(selectLowStockArray)
    const renderedArray = useSelector(selectRenderedArray)

    function thresholdHandler() {
        dispatch(setThreshold((threshold + 50)))
    }

    useEffect(() => {
        if (supplier) {
            let tempArray = []
            supplierItems[supplier].forEach((value) => {
                if (value.lowStock) tempArray.push(value)
            })
            dispatch(setLowStockArray(tempArray))
            dispatch(setRenderedArray(tempArray))
        }
    }, [supplier, supplierItems])

    function radioButtonsHandler(checked: boolean, box: string) {
        if (box === "lowStock" && checked) {
            dispatch(setRadioButtons({lowStock: true, allItems: false}))
            dispatch(setRenderedArray(lowStockArray))
            dispatch(setThreshold(50))
        }
        if (box === "allItems" && checked) {
            setRadioButtons({lowStock: false, allItems: true})
            dispatch(setRadioButtons({lowStock: true, allItems: false}))
            dispatch(setRenderedArray(supplierItems))
            dispatch(setThreshold(50))
        }
    }

    function inputChangeHandler(value, key, index) {
        dispatch(setInputChange({key: key, index:index, value:value}))

    }

    function addToOrderHandler(SKU: string, index:number) {
        let lowStockIndex = lowStockArray.findIndex(item => item.SKU === SKU)
        let fullStockIndex = supplierItems.findIndex(item => item.SKU === SKU)
        dispatch(setChangeOrderArray({item:renderedArray[index], type: "add", index:fullStockIndex}))
        if(lowStockIndex >= 0) thresholdAndArray.lowStockArray.splice(lowStockIndex, 1)
    }

    function buildListRow(item: item, index: number, allItems: boolean) {
        let tempArray = []
        tempArray.push(
            <div key={item.SKU}
                 className="shop-orders-table shop-orders-table-cells low-stock-list-grid">
                <button key={item.SKU + 0} onClick={() => {
                    addToOrderHandler(item.SKU, index)
                }}>⇅
                </button>
                <span className={"center-align"}>{item.STOCKTOTAL} </span>
                <span className={"center-align"}>{item.MINSTOCK} </span>
                <span>{item.SKU} </span>
                <span>{item.TITLE} </span>
                <input value={renderedArray[index].qty} onChange={(e) => {
                    inputChangeHandler(e.target.value, "qty", index)
                }}/>
                <input value={renderedArray[index].tradePack} onChange={(e) => {
                    inputChangeHandler(e.target.value, "tradePack", index)
                }}/>
                <span className={"center-align"}>£{item.PURCHASEPRICE.toFixed(2)}</span>
                <span className={"dead-stock-image-parent"}>{item.deadStock ?
                    <Image key={item.SKU + 9} src="../../../public/dead-stock-icon.webp"
                         alt={"dead-stock-icon"}/> : ""}</span>
            </div>
        )
        if (allItems) {
            tempArray.push(<button key={item.SKU + "button"} onClick={() => {
                thresholdHandler();
            }}>Load more items</button>)
        }
        return <Fragment key={item.SKU + 10}>{tempArray}</Fragment>
    }

    function buildList() {
        let tempArray = []
        for (let i = 0; i < renderedArray.length; i++) {
            let allItems = false
            if (i === thresholdAndArray.threshold && i < thresholdAndArray.renderedArray.length) allItems = true
            tempArray.push(buildListRow(thresholdAndArray.renderedArray[i], i, allItems))

            if (i === thresholdAndArray.threshold) break
        }
        return <>{tempArray}</>
    }

    function buildSearchBar() {
        if (radioButtons.allItems) {
            return <SearchBar searchableArray={thresholdAndArray.fullArray} EAN={false}
                              itemIndex={(x) => setNewRenderedArray(x)}/>
        }
        if (radioButtons.lowStock) {
            return <SearchBar searchableArray={thresholdAndArray.lowStockArray} EAN={false}
                              itemIndex={(x) => setNewRenderedArray(x)}/>
        }
    }

    function setNewRenderedArray(filteredArray) {
        console.log(filteredArray)
        setThresholdAndArray({
            supplier: thresholdAndArray.supplier,
            threshold: 50,
            renderedArray: filteredArray,
            lowStockArray: thresholdAndArray.lowStockArray,
            fullArray: thresholdAndArray.fullArray
        })
    }

    if (props.supplier) {
        return (
            <div className="shop-orders-table-containers" id={"stock-list-table"}>
                <div className="table-title-container">
                    <span>Low Stock List</span>
                    <span className={"primary-buttons"}>
                        <label htmlFor={"low-Stock"}>Low Stock</label><input type={"radio"}
                                                                             checked={radioButtons.lowStock}
                                                                             id={"low-Stock"} name="display-toggle"
                                                                             onChange={(e) => radioButtonsHandler(e.target.checked, "lowStock")}/>
                    <label htmlFor={"all-items"}>All Items</label><input type={"radio"} checked={radioButtons.allItems}
                                                                         id={"all-items"} name="display-toggle"
                                                                         onChange={(e) => radioButtonsHandler(e.target.checked, "allItems")}/></span>
                </div>
                <div>{buildSearchBar()}</div>
                <div className="shop-orders-table low-stock-list-grid">
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
}

