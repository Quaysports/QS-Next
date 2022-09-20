import SearchBar from "../../components/search-bar";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {
    selectDomesticToggle, selectListToggle,
    selectShowToggle,
    setDomesticToggle, setListToggle,
    setShowToggle
} from "../../store/stock-forecast-slice";
import { useRouter } from "next/router";

export default function StockForecastMenuTabs(){

    const router = useRouter()
    const showToggle = useSelector(selectShowToggle)
    const domesticToggle = useSelector(selectDomesticToggle)
    const listToggle = useSelector(selectListToggle)

    console.log(router.query)

    const dispatch = useDispatch()

    function searchResult(arr:any[]){
        console.log(arr)
    }

    return (
        <>
            {showToggle ? <span><Link href={{pathname:router.pathname,query:{...router.query, show:"true"}}}>Show</Link></span> : null}
            {showToggle ? null : <span><Link href="/shipments?show=false">Hide</Link></span>}
            {domesticToggle ? <span><Link href="/shipments">International</Link></span> : null}
            {domesticToggle ? null : <span><Link href="/shipments">Domestic</Link></span>}
            <span>List</span>
            <span><Link href="/shipments">Shipments</Link></span>
            <span>Supplier Select</span>
            <SearchBar itemIndex={x => searchResult(x)}/>
        </>
    )
}