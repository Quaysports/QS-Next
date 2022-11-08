import SearchBar from "../../components/search-bar";
import Link from "next/link";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {dispatchNotification} from "../../server-modules/dispatch-notification";
import SupplierSelect from "./supplier-select-popup";

interface Props {
    searchData:StockForecastItem[] | null;
    updateItemsHandler:(items:StockForecastItem[])=>void
}

export default function StockForecastMenuTabs({searchData, updateItemsHandler}:Props){

    const router = useRouter()

    const [domesticToggle, setDomesticToggle] = useState(router.query.domestic)
    const [showToggle,setShowToggle] = useState(router.query.show)
    const [listToggle, setListToggle] = useState(router.query.list)

    useEffect(()=>{
        setShowToggle(router.query.show)
        setDomesticToggle(router.query.domestic)
        setListToggle(router.query.list)
    },[router.query])

    return (
        <>
            {showToggle === 'true'
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, show:false}}}>Hide</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, show:true}}}>Show</Link></span>}
            {domesticToggle === 'true'
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:false}}}>International</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:true}}}>Domestic</Link></span>}
            <span><Link href={{pathname:router.pathname, query:{...router.query, list:listToggle === 'true' ? 'false': 'true'}}}>List</Link></span>
            <span><Link href="/shipments">Shipments</Link></span>
            <span onClick={async()=>{
                dispatchNotification({type:"popup", title:"Supplier Select", content:<SupplierSelect/>})
            }}>Supplier Select</span>
            <SearchBar
                resultHandler={result => updateItemsHandler(result as StockForecastItem[])}
                EAN={false}
                searchableArray={searchData ? searchData : []}/>
        </>
    )
}