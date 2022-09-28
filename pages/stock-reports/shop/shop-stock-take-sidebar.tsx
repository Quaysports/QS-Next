import SidebarButton from "../../../components/layouts/SidebarButton";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setBrandItems} from "../../../store/stock-reports-slice";

export default function ShopStockTakeSidebar({brands}){

    const [activeElement,setActiveElement] = useState("")
    const dispatch = useDispatch()

    const clickHandler = (brand)=>{
        setActiveElement(brand)
        const opts = {method: 'POST', body: brand}
        fetch("/api/stock-report/get-brand-items",opts).then(async(res) => {
            dispatch(setBrandItems(await res.json()))
        })
    }

    function buildBrandsList(){
        let elements = []
        if(!brands) return null
        for(const brand of brands){elements.push(
            <SidebarButton key={brand} active={activeElement === brand} onClick={()=>clickHandler(brand)}>{brand}</SidebarButton>
        )}
        return elements
    }

    return(
        <>{
            buildBrandsList()
        }</>
    )
}