import SearchBar from "../../components/search-bar";
import Link from "next/link";
import styles from "./margin-calculator.module.css"
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {MarginItem, selectSuppliers} from "../../store/margin-calculator-slice";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import MarginCalculatorFilters from "./filter-popup";
import {useSelector} from "react-redux";

interface Props {
    searchData:MarginItem[] | null;
    updateItemsHandler:(items:MarginItem[])=>void
}

export default function MarginCalculatorMenuTabs({searchData, updateItemsHandler}:Props){

    const router = useRouter()
    const suppliers = useSelector(selectSuppliers)

    const [domesticToggle, setDomesticToggle] = useState<boolean>(router.query.domestic === "true")
    const [showToggle,setShowToggle] = useState<boolean>(router.query.show === "true")
    const [brand, setBrand] = useState<string | string[]>("placeholder")

    function createSupplierOptions(){
        return suppliers.map(supplier=><option key={supplier} value={supplier}>{supplier}</option>)
    }

    useEffect(()=>{
        setShowToggle(router.query.show === "true")
        setDomesticToggle(router.query.domestic === "true")
        setBrand(brand ? brand : "")
    },[router.query])

    return (
        <>
            <span onClick={()=>dispatchNotification({type:"popup",title:"filters", content:<MarginCalculatorFilters/>})}>Filters</span>
            {showToggle
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, show:false}}}>Hide</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, show:true}}}>Show</Link></span>}
            {domesticToggle
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:false}}}>International</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:true}}}>Domestic</Link></span>}
            <span>
                <select defaultValue={brand}
                        className={styles["tab-select"]}
                        onChange={
                    async (e)=>{
                        let query:{brand?:string} = {...router.query, brand:e.target.value}

                        if(e.target.value === "") delete query.brand

                        await router.push({pathname:router.pathname, query:query})
                    }
                }>
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
            <span onClick={async()=>{
                const opt = {method: 'POST', headers:{"Content-Type":"application/json"}}
                await fetch('/api/margin/update', opt)
                router.reload()
            }}>Update All Margins</span>
            <span/>
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