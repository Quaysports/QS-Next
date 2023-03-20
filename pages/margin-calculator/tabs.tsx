import SearchBar from "../../components/search-bar";
import Link from "next/link";
import styles from "./margin-calculator.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {MarginItem, selectSuppliers} from "../../store/margin-calculator-slice";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {useSelector} from "react-redux";
import MarginMenu from "./popups/margin-menu-popup";
import MarginItemTest from "./margin-test";
import StockTotalsPopup from "./popups/stock-totals-popup";
import ParcelInfoPopup from "./popups/parcel-info-popup";

interface Props {
    searchData: MarginItem[] | null;
    updateItemsHandler: (items: MarginItem[]) => void
}

export default function MarginCalculatorMenuTabs({searchData, updateItemsHandler}: Props) {

    const router = useRouter()
    const suppliers = useSelector(selectSuppliers)

    const [domesticToggle, setDomesticToggle] = useState<boolean>(router.query.domestic === "true")
    const [showToggle, setShowToggle] = useState<boolean>(router.query.show === "true")
    const [brand, setBrand] = useState<string | string[]>("placeholder")

    function createSupplierOptions() {
        return suppliers.map(supplier => <option key={supplier} value={supplier}>{supplier}</option>)
    }

    useEffect(() => {
        setShowToggle(router.query.show === "true")
        setDomesticToggle(router.query.domestic === "true")
        setBrand(brand ? brand : "")
    }, [router.query])

    function generateDate() {
        let date = new Date()
        return `${date.getFullYear() - 1} / ${date.getFullYear()}`
    }

    return (
        <>
            <span onClick={() => dispatchNotification({type: "popup", title: "Margin Menu", content: <MarginMenu/>})}>Margin Menu</span>
            {showToggle
                ?
                <span><Link href={{pathname: router.pathname, query: {...router.query, show: false}}}>Hide</Link></span>
                :
                <span><Link href={{pathname: router.pathname, query: {...router.query, show: true}}}>Show</Link></span>}
            {domesticToggle
                ? <span>
                    <Link href={{pathname: router.pathname, query: {...router.query, domestic: false}}}
                          onClick={() => {
                              dispatchNotification({type: "loading"})
                          }}>International</Link>
            </span>
                : <span>
                    <Link href={{pathname: router.pathname, query: {...router.query, domestic: true}}} onClick={() => {
                        dispatchNotification({type: "loading"})
                    }}>Domestic</Link>
                </span>}
            <span/>
            <span onClick={() => dispatchNotification({
                type: "popup",
                title: "Stock Totals",
                content: <StockTotalsPopup/>
            })}>Stock Totals</span>
            <span onClick={() => dispatchNotification({
                    type: "popup",
                    title: "Margin Item Test",
                    content: <MarginItemTest/>
                }
            )}>Test Item</span>
            <span onClick={() => dispatchNotification({
                    type: "popup",
                    title: `Parcel Info for ${generateDate()}`,
                    content: <ParcelInfoPopup/>
                }
            )}>Parcel Info</span>
            <span/>
            <span>
                <select defaultValue={brand}
                        className={styles["tab-select"]}
                        onChange={async (e) => {
                            let query: { brand?: string } = {...router.query, brand: e.target.value}
                            if (e.target.value === "") delete query.brand
                            dispatchNotification({type: "loading", content:"Switching Brand..."})
                            await router.push({pathname: router.pathname, query: query})
                        }}>
                    <option value={""}>All Brands...</option>
                    {createSupplierOptions()}
                </select>
            </span>
            <span/>
            <SearchBar
                resultHandler={result => updateItemsHandler(result as MarginItem[])}
                EAN={false}
                searchableArray={searchData ? searchData : []}/>
            <span/>

            <span/>

        </>
    )
}