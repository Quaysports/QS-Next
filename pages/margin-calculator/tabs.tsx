import SearchBar from "../../components/search-bar";
import Link from "next/link";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {MarginItem} from "../../store/margin-calculator-slice";
import {dispatchNotification} from "../../server-modules/dispatch-notification";
import MarginCalculatorFilters from "./filter-popup";

interface Props {
    searchData:MarginItem[] | null;
    updateItemsHandler:(items:MarginItem[])=>void
}

export default function MarginCalculatorMenuTabs({searchData, updateItemsHandler}:Props){

    const router = useRouter()

    const [domesticToggle, setDomesticToggle] = useState(router.query.domestic)
    const [showToggle,setShowToggle] = useState(router.query.show)

    useEffect(()=>{
        setShowToggle(router.query.show)
        setDomesticToggle(router.query.domestic)
    },[router.query])

    return (
        <>
            <span onClick={()=>dispatchNotification({type:"popup",title:"filters", content:<MarginCalculatorFilters/>})}>Filters</span>
            {showToggle === 'true'
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, show:false}}}>Hide</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, show:true}}}>Show</Link></span>}
            {domesticToggle === 'true'
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:false}}}>International</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:true}}}>Domestic</Link></span>}
            <span></span>
            <SearchBar
                resultHandler={result => updateItemsHandler(result as MarginItem[])}
                EAN={false}
                searchableArray={searchData ? searchData : []}/>
        </>
    )
}