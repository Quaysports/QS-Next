import QuickLinksSidebarButton from "./quick-link-sidebar-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkSidebarAddButton from "./quick-link-sidebar-add-button";
import SidebarLayout from "../../../components/layouts/sidebar-layout";

export default function QuickLinksSidebar({id, idHandler}){

    const links = useSelector(selectQuickLinks)

    function createLinkButtons(links){
        let buttons = []
        for(let i in links){
            buttons.push(<QuickLinksSidebarButton key={i} id={i} active={i === id} handler={idHandler} text={links[i].id} />)
        }
        return buttons
    }

    return(
        <>
            <SidebarLayout>
                    {createLinkButtons(links)}
                    {links.length < 6 ? <QuickLinkSidebarAddButton type={"parent"}/> : null}
            </SidebarLayout>
        </>
    )
}