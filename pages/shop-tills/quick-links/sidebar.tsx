import QuickLinksSidebarButton from "./quick-link-sidebar-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkSidebarAddButton from "./quick-link-sidebar-add-button";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
/**
 * Quick Links Sidebar component
 */
export default function QuickLinksSidebar() {

    const links = useSelector(selectQuickLinks)

    let buttons = []
    for (let i in links) {
        buttons.push(
            <QuickLinksSidebarButton
                key={i}
                index={Number(i)}
                text={links[i].id}/>)
    }

    return (
        <>
            <SidebarLayout>
                {buttons}
                {links.length < 6 ? <QuickLinkSidebarAddButton/> : null}
            </SidebarLayout>
        </>
    )
}