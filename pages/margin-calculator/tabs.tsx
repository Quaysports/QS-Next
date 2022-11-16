import SearchBar from "../../components/search-bar";
import Link from "next/link";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {MarginItem} from "../../store/margin-calculator-slice";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
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
            <span></span>
            <span onClick={()=>{
                const opts = {
                    method: 'POST',
                    headers: {"token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"}
                }

                fetch("/api/linnworks/update-channel-prices", opts).then(async(res)=>{
                    console.log(res.json())
                })
            }}>Update All Channel Prices</span>
        </>
    )
}