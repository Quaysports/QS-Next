import * as React from 'react';
import {useEffect, useState} from "react";
import SearchBar, {SearchItem} from "../../../components/search-bar/index";
import {
    selectRadioButtons,
    selectSupplierItems,
    setRadioButtons,
    setRenderedArray,
    setThreshold
} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";
import styles from '../shop-orders.module.css'
import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import {useRouter} from "next/router";
import BuildStockList from "./build-stock-list";

export default function StockList() {

    const dispatch = useDispatch()
    const router = useRouter()
    const radioButtons = useSelector(selectRadioButtons)
    const supplierItems = useSelector(selectSupplierItems)
    const [rerender, setRerender] = useState<boolean>(false)
    const [searchableArray, setSearchableArray] = useState<orderObject[]>([])
    const [brandList, setBrandList] = useState<string[]>([])

    useEffect(() => {
        let tempArray: orderObject[] = []
        let lowStockBrandArray: orderObject[] = []
        let brandArray: orderObject[] = []
        let newBrandList: string[] = ["All Items"]

        supplierItems.forEach((value) => {
            if (router.query.brand !== "All Items") {
                if (value.brand === router.query.brand) {
                    if (value.lowStock) {
                        tempArray.push(value)
                        lowStockBrandArray.push(value)
                    }
                    brandArray.push(value)
                }
            } else if (value.lowStock) tempArray.push(value)
            if (!newBrandList.includes(value.brand)) {
                newBrandList.push(value.brand)
            }
        })
        setBrandList(newBrandList)


        tempArray.sort((a, b) => {
            return a.stock.total < b.stock.total ? -1 : (a.stock.total > b.stock.total ? 1 : 0)
        })
        brandArray ? brandArray.sort((a, b) => {
            return a.stock.total < b.stock.total ? -1 : (a.stock.total > b.stock.total ? 1 : 0)
        }) : null

        if (radioButtons.lowStock) {
            if (router.query.brand !== "All Items") {
                dispatch(setRenderedArray(lowStockBrandArray))
                setSearchableArray(lowStockBrandArray)
            } else {
                dispatch(setRenderedArray(tempArray))
                setSearchableArray(tempArray)
            }
        } else {
            if (router.query.brand !== "All Items") {
                dispatch(setRenderedArray(brandArray))
                setSearchableArray(brandArray)
            } else {
                dispatch(setRenderedArray(supplierItems))
                setSearchableArray(supplierItems)
            }
        }
    }, [supplierItems, rerender])

    function radioButtonsHandler(checked: boolean, box: string) {
        if (box === "lowStock" && checked) {
            dispatch(setRadioButtons({lowStock: true, allItems: false}))
            dispatch(setThreshold(50))
            setRerender(!rerender)
        }
        if (box === "allItems" && checked) {
            dispatch(setRadioButtons({lowStock: false, allItems: true}))
            dispatch(setThreshold(50))
            setRerender(!rerender)
        }
    }

    function buildSearchBar() {
        if (radioButtons.allItems) {
            return <SearchBar resultHandler={(x) => setNewRenderedArray(x)} EAN={false}
                              searchableArray={searchableArray}/>
        }
        if (radioButtons.lowStock) {
            return <SearchBar resultHandler={(x) => setNewRenderedArray(x)} EAN={false}
                              searchableArray={searchableArray}/>
        }
        return null
    }

    function setNewRenderedArray(filteredArray: SearchItem[]) {
        dispatch(setThreshold(50))
        dispatch(setRenderedArray(filteredArray as orderObject[]))
    }

    function buildBrandFilters() {
        let tempArray: JSX.Element[] = []
        if (brandList.length > 2) {
            for (const brand of brandList) {
                tempArray.push(<option key={brand}>{brand}</option>)
            }
            return <>{tempArray}</>
        } else {
            return null
        }
    }

    return (
        <div className={styles["shop-orders-table-containers"]}>
            <div className={styles["table-title-container"]}>
                <span>Low Stock List</span>
                <span className={styles["primary-buttons"]}>
                        <label htmlFor={"low-Stock"}>Low Stock</label><input type={"radio"}
                                                                             checked={radioButtons.lowStock}
                                                                             id={"low-Stock"} name="display-toggle"
                                                                             onChange={(e) => radioButtonsHandler(e.target.checked, "lowStock")}/>
                    <label htmlFor={"all-items"}>All Items</label><input type={"radio"} checked={radioButtons.allItems}
                                                                         id={"all-items"} name="display-toggle"
                                                                         onChange={(e) => radioButtonsHandler(e.target.checked, "allItems")}/>
                </span>
                <span id={styles["brand-filter-select"]}>{brandList.length > 2 ? <select onChange={e => router.push({
                    query: {
                        ...router.query,
                        brand: e.target.value
                    }
                })}>{buildBrandFilters()}</select> : null}</span>
            </div>
            <div className={styles["search-bar-wrapper"]}>{buildSearchBar()}</div>
            <div className={`${styles["shop-orders-table"]} ${styles["new-order-list-grid"]}`}>
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
                <BuildStockList/>
            </div>
        </div>
    );

}