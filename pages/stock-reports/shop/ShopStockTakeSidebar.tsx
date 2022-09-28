import SidebarButton from "../../../components/layouts/SidebarButton";
import {useState} from "react";

export default function ShopStockTakeSidebar({brands}){

    const [activeElement,setActiveElement] = useState("")

    const clickHandler = (brand)=>{
        setActiveElement(brand)
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