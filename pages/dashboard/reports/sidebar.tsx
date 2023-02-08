import SidebarSelect from "../../../components/layouts/sidebar-select";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import {useRouter} from "next/router";

export default function Sidebar(){

    const router = useRouter()

    const selectHandler = (route:string) => {
        router.push({query:{...router.query, location: route}})
    }

    return (
        <SidebarLayout>
            <SidebarSelect value={router.query.location as string | undefined} onChange={(e) => {selectHandler(e.target.value)}}>
                <option value={"shop"}>Shop</option>
                <option value={"online"}>Online</option>
            </SidebarSelect>
        </SidebarLayout>
    )
}