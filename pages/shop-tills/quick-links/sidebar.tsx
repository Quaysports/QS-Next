import QuickLinksSidebarButton from "./quick-link-sidebar-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkSidebarAddButton from "./quick-link-sidebar-add-button";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import {QuickLinks} from "../../../server-modules/shop/shop";

/**
 * @param {number} id - Index of active button.
 * @param {idHandler} idHandler - Function that updates the active button ID
 */
interface Props {
    id:number;
    idHandler: (id:number)=>void;
}

/**
 * Quick Links Sidebar component
 */
export default function QuickLinksSidebar({id, idHandler}:Props){

    const links = useSelector(selectQuickLinks)

    function createLinkButtons(links:QuickLinks[]){
        let buttons = []
        for(let i in links){
            buttons.push(
                <QuickLinksSidebarButton key={i} id={Number(i)} active={Number(i) === id} handler={idHandler} text={links[i].id}/>
            )
        }
        return buttons
    }

    return(
        <>
            <SidebarLayout>
                    {createLinkButtons(links)}
                    {links.length < 6 ? <QuickLinkSidebarAddButton/> : null}
            </SidebarLayout>
        </>
    )
}