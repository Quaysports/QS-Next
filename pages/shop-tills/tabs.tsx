import Link from "next/link";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/session-slice";

/**
 * Menu tabs for Shop Tills page
 */
export default function ShopTabs(){

    const user = useSelector(selectUser)

    return(
        <>
            <span><Link href={"/shop-tills?tab=pick-list"}>Pick List</Link></span>
            {user.permissions.shopTillsQuickLinks?.auth ?
                <span><Link href={"/shop-tills?tab=quick-links"}>Quick Link Setup</Link></span> : null
            }
        </>
    )
}