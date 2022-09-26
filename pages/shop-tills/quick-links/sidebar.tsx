import styles from '../shop-tills.module.css'
import QuickLinksSidebarButton from "./quick-link-sidebar-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks";
import QuickLinkSidebarAddButton from "./quick-link-sidebar-add-button";

export default function QuickLinksSidebar({idHandler}){

    const links = useSelector(selectQuickLinks)

    function createLinkButtons(links){
        let buttons = []
        for(let i in links){
            buttons.push(<QuickLinksSidebarButton key={i} id={i} handler={idHandler} text={links[i].id} />)
        }
        return buttons
    }

    return(
        <>
            <div className={styles.sidebar}>
                <div>
                    {createLinkButtons(links)}
                    {links.length < 6 ? <QuickLinkSidebarAddButton type={"parent"}/> : null}
                </div>
            </div>
        </>
    )
}