import SidebarSelect from "../../../components/layouts/sidebar-select";
import {useRouter} from "next/router";

export default function SalesSidebar(){
    return <>
        <LocationSelect/>
    </>
}

function LocationSelect(){
    let router = useRouter()
    let location = router.query.location ? router.query.location : "shop"

    function handler(location:string){
        router.push({pathname: router.pathname ,query:{...router.query, location:location}})
    }

    return <>
        <SidebarSelect value={location as string} onChange={(e)=>handler(e.target.value)}>
            <option value={"shop"}>Shop</option>
            <option value={"online"}>Online</option>
        </SidebarSelect>
    </>
}