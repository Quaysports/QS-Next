import styles from "../margin-calculator.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectRenderedItems, selectSearchData, updateUploadedIndexes} from "../../../store/margin-calculator-slice";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {generateMarginText} from "../../../components/margin-calculator-utils/margin-styler";
import CSVButton from "../../../components/csv-button";
import {selectMarginSettings} from "../../../store/session-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { roundToNearest } from "../../../components/utils/utils";
import { dispatchNotification } from "../../../components/notification/dispatch-notification";


export default function MagentoTable() {

    const [resetPrices, setResetPrices] = useState(false)
    const [numberOfPricesToReset, setNumberOfPricesToReset] = useState(0)
    const [updateSpecialPrices, setUpdateSpecialPrices] = useState(false)
    const [numberOfSpecialPricesToUpdate, setNumberOfSpecialPricesToUpdate] = useState(0)
    const items = useSelector(selectRenderedItems)
    const itemsForCSV = useSelector(selectSearchData)
    const settings = useSelector(selectMarginSettings)
    const router = useRouter();
    const domestic = router.query.domestic === "true";
    const updateItem = useUpdateItemAndCalculateMargins();
    const dispatch = useDispatch()

    useEffect(() => {
        let pricesToReset = 0
        for (let item of items) {
            if (item.prices.magento !== item.prices.retail) {
                pricesToReset++
            }
        }
        setNumberOfPricesToReset(pricesToReset)
    },[items])

    useEffect(() => {
        let specialPricesToUpdate = 0
        for (let item of items) {
            if ((item.prices.magentoSpecial) !== roundToNearest(item.prices.retail * (1 - (item.discounts.magento / 100)))) {
                specialPricesToUpdate++
            }
        }
        setNumberOfSpecialPricesToUpdate(specialPricesToUpdate)
    }, [items])

    const handleMagentoPricesReset = async () => {
        setResetPrices(true)
        for (let item of items) {
            if (item.prices.magento !== item.prices.retail) {
                const update = {
                    ...item.prices,
                    magento: item.prices.retail
                };
                await updateItem(item, "prices", update)
            }
        }
        setResetPrices(false)
    }

    const handleMagentoSpecialPricesUpdates = async () => {
        setUpdateSpecialPrices(true)
        for (let item of items) {
            if ((item.prices.magentoSpecial) !== roundToNearest(item.prices.retail * (1 - (item.discounts.magento / 100)))) {
                await updateItem(item, "discounts", {
                    ...item.discounts,
                    magento: Math.round(Number(item.discounts.magento.toString())),
                  });
            }
        }
        setUpdateSpecialPrices(false)
    }

    const handleUploadAllItemsToLinnworks = async () => {
        for (let index in items) {
            const item = items[index]
            const opts = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({items:[item]})
            }
    
            fetch("/api/linnworks/update-channel-prices", opts).then(async()=>{
                dispatchNotification({type: "loading", title: "Uploading prices to Linnworks"})
                await updateItem(item)
                dispatch(updateUploadedIndexes(index))
                dispatchNotification()
            })
        }
    }

    function CSVData(){
        return itemsForCSV.reduce((arr:any[], item)=>{
            arr.push({
                SKU:item.SKU,
                TITLE:item.title,
                PRICE:item.prices.magento,
                DISCOUNT:item.discounts.magento,
                SPECIAL: item.prices.magentoSpecial,
                MARGIN:generateMarginText(item.prices.purchase, item.marginData.magento.profit ),
                NOTE:item.marginNote})
            return arr
        },[])
    }

    if (!items || items.length === 0) return null

    if (!settings?.tables.MagentoTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <div><TitleLink type={"Magento"}/></div>
                <div className={styles["header-buttons"]}>
                    <CSVButton fileName={`Magento CSV - ${Date.now()}`}
                               objectArray={CSVData()}
                               label={"CSV"}/>
                    {domestic && <button
                    disabled={resetPrices || numberOfPricesToReset <= 0}
                    onClick={handleMagentoPricesReset}
                >{!resetPrices ? "Reset Prices to RRP" : "Resetting Prices"}</button>}
                {domestic && <button
                    disabled={updateSpecialPrices || numberOfSpecialPricesToUpdate <= 0}
                    onClick={handleMagentoSpecialPricesUpdates}
                >{!updateSpecialPrices ? "Update Special Prices" : "Updating Special Prices"}</button> }
                {domestic && <button
                onClick={handleUploadAllItemsToLinnworks} >
                    Upload all to Linnworks
                </button>}
                </div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for (let index in items) elements.push(<ItemRow key={items[index].SKU}
                                                        item={items[index]}
                                                        index={index}/>)
        
        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}