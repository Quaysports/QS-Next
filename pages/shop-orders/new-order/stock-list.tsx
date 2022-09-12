import * as React from 'react';
import {item} from "../landing-page/landing-page";
import {Fragment, useEffect, useState} from "react";
import SearchBar from "../../search-bar/search-bar";

interface LowStockListProps {
    addToOrderArray: (item: item, index: number) => void;
    supplier: string;
    loadList: string;
    supplierItems: Map<string, item[]>
}

interface radioButtonState {
    lowStock: boolean,
    allItems: boolean
}

interface thresholdAndArrayState {
    supplier: string;
    threshold: number;
    renderedArray: item[];
    lowStockArray: item[];
    fullArray: item[];
}

export default function StockList(props: LowStockListProps) {

    const [radioButtons, setRadioButtons] = useState<radioButtonState>({
        lowStock: true,
        allItems: false
    })
    const [thresholdAndArray, setThresholdAndArray] = useState<thresholdAndArrayState>({
        supplier: props.supplier,
        threshold: 50,
        renderedArray: [],
        lowStockArray: [],
        fullArray: []
    })

    function thresholdHandler() {
        setThresholdAndArray({
            supplier: props.supplier,
            threshold: thresholdAndArray.threshold + 50,
            renderedArray: thresholdAndArray.renderedArray,
            lowStockArray: thresholdAndArray.lowStockArray,
            fullArray: thresholdAndArray.fullArray
        })
    }

    useEffect(() => {
        if (props.supplier) {
            let tempArray = []
            props.supplierItems.get(props.supplier).forEach((value) => {
                if (value.lowStock) tempArray.push(value)
            })
            setThresholdAndArray({
                supplier: props.supplier,
                threshold: 50,
                renderedArray: tempArray,
                lowStockArray: tempArray,
                fullArray: props.supplierItems.get(props.supplier)
            })
        }
    }, [props.supplier, props.supplierItems])

    function radioButtonsHandler(checked: boolean, box: string) {
        if (box === "lowStock" && checked) {
            setRadioButtons({lowStock: true, allItems: false})
            setThresholdAndArray({
                supplier: props.supplier,
                threshold: 50,
                renderedArray: thresholdAndArray.lowStockArray,
                lowStockArray: thresholdAndArray.lowStockArray,
                fullArray: thresholdAndArray.fullArray
            })
        }
        if (box === "allItems" && checked) {
            setRadioButtons({lowStock: false, allItems: true})
            setThresholdAndArray({
                supplier: props.supplier,
                threshold: 50,
                renderedArray: thresholdAndArray.fullArray,
                lowStockArray: thresholdAndArray.lowStockArray,
                fullArray: thresholdAndArray.fullArray
            })
        }
    }

    function inputChangeHandler(value, key, index) {
        let tempArray
        if (radioButtons.lowStock) {
            tempArray = thresholdAndArray.lowStockArray
            if (key === "qty") tempArray[index].qty = Number(value);
            if (key === "tradePack") tempArray[index].tradePack = Number(value);
            setThresholdAndArray({
                supplier: thresholdAndArray.supplier,
                threshold: thresholdAndArray.threshold,
                renderedArray: thresholdAndArray.renderedArray,
                lowStockArray: tempArray,
                fullArray: thresholdAndArray.fullArray
            })
        }
        if (radioButtons.allItems) {
            tempArray = thresholdAndArray.renderedArray
            if (key === "qty") tempArray[index].qty = Number(value);
            if (key === "tradePack") tempArray[index].tradePack = Number(value);
            setThresholdAndArray({
                supplier: thresholdAndArray.supplier,
                threshold: thresholdAndArray.threshold,
                renderedArray: tempArray,
                lowStockArray: thresholdAndArray.lowStockArray,
                fullArray: thresholdAndArray.fullArray
            })
        }
    }

    function addToOrderHandler(SKU: string, index:number) {
        let lowStockIndex = thresholdAndArray.lowStockArray.findIndex(item => item.SKU === SKU)
        let fullStockIndex = thresholdAndArray.fullArray.findIndex(item => item.SKU === SKU)
        props.addToOrderArray(thresholdAndArray.renderedArray[index], fullStockIndex)
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
                <input value={thresholdAndArray.renderedArray[index].qty} onChange={(e) => {
                    inputChangeHandler(e.target.value, "qty", index)
                }}/>
                <input value={thresholdAndArray.renderedArray[index].tradePack} onChange={(e) => {
                    inputChangeHandler(e.target.value, "tradePack", index)
                }}/>
                <span className={"center-align"}>£{item.PURCHASEPRICE.toFixed(2)}</span>
                <span className={"dead-stock-image-parent"}>{item.deadStock ?
                    <img key={item.SKU + 9} src={require("../../images/dead-stock-icon.webp")}
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
        for (let i = 0; i < thresholdAndArray.renderedArray.length; i++) {
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

