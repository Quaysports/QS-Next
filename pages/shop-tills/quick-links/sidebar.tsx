import QuickLinksSidebarButton from "./quick-link-sidebar-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkSidebarAddButton from "./quick-link-sidebar-add-button";
import SidebarLayout from "../../../components/layouts/sidebar-layout";

/**
 * @param {number} id - Index of active button.
 * @param {idHandler} idHandler - Function that updates the active button ID
 */
interface Props {
    id: number;
    idHandler: (id: number) => void;
}

/**
 * Quick Links Sidebar component
 */
export default function QuickLinksSidebar({id, idHandler}: Props) {

    const links = useSelector(selectQuickLinks)

    let buttons = []
    for (let i in links) {
        buttons.push(
            <QuickLinksSidebarButton
                key={i}
                index={Number(i)}
                active={Number(i) === id}
                handler={idHandler}
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