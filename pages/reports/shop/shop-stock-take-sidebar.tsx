import SidebarButton from "../../../components/layouts/sidebar-button";
import {useState} from "react";
import {useSelector} from "react-redux";
import {selectBrands} from "../../../store/reports/stock-reports-slice";
import {useRouter} from "next/router";

export default function ShopStockTakeSidebar(){

    const brands = useSelector(selectBrands)
    const router = useRouter()
    const [activeElement,setActiveElement] = useState("")

    const clickHandler = (brand:string)=>{
        setActiveElement(brand)
        router.push({pathname: router.pathname ,query:{...router.query, brand:brand}})
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