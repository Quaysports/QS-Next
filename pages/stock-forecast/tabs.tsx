import SearchBar, {SearchItem} from "../../components/search-bar";
import Link from "next/link";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import SupplierSelect from "./supplier-select-popup";
import {useDispatch, useSelector} from "react-redux";
import {selectItems, setSearchItems} from "../../store/stock-forecast-slice";
import {StockForecastItem} from "./index";
export default function StockForecastMenuTabs(){

    const router = useRouter()
    const items = useSelector(selectItems)
    const dispatch = useDispatch()

    const [domesticToggle, setDomesticToggle] = useState(router.query.domestic)
    const [showToggle,setShowToggle] = useState(router.query.show)
    const [listToggle, setListToggle] = useState(router.query.list)

    const handler = (items:SearchItem[])=>{
        dispatch(setSearchItems(items as StockForecastItem[]))
    }

    useEffect(()=>{
        setShowToggle(router.query.show)
        setDomesticToggle(router.query.domestic)
        setListToggle(router.query.list)
    },[router.query])

    function loading(){
        dispatchNotification({type:"loading"})
    }

    return (
        <>
            {showToggle === 'true'
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, show:false}}} onClick={loading}>Hide</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, show:true}}} onClick={loading}>Show</Link></span>}
            {domesticToggle === 'true'
                ? <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:false}}} onClick={loading}>International</Link></span>
                : <span><Link href={{pathname:router.pathname, query:{...router.query, domestic:true}}} onClick={loading}>Domestic</Link></span>}
            <span><Link href={{pathname:router.pathname, query:{...router.query, list:listToggle === 'true' ? 'false': 'true'}}} onClick={loading}>List</Link></span>
            <span><Link href="/shipments">Shipments</Link></span>
            <span onClick={async()=>{
                dispatchNotification({type:"popup", title:"Supplier Select", content:<SupplierSelect/>})
            }}>Supplier Select</span>
            <SearchBar
                resultHandler={handler}
                EAN={false}
                searchableArray={items || []}/>
        </>
    )
}