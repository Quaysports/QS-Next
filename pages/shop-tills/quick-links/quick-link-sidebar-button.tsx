import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import EditQuickLinkMenuPopup from "./edit-quicklink-menu-popup";
import SidebarButton from "../../../components/layouts/sidebar-button";
import {useRouter} from "next/router";

/**
 * @param {number} index - Index of element in the Quick Link array in
 * @param {string} text - Button text
 */
interface Props {
    index:number;
    text:string;
}

export default function QuickLinksSidebarButton({index, text}:Props){
    const router = useRouter()
    const activeIndex = Number(router.query.linksIndex)
    return(
        <SidebarButton active={activeIndex === index} className={styles["sidebar-button"]}>
            <div className={styles["sidebar-button-edit"]} onClick={()=>dispatchNotification({
                type:"popup",
                title:"New QuickLink Menu",
                content:<EditQuickLinkMenuPopup/>
            })}>&#9998;</div>
            <div className={styles["sidebar-button-title"]} onClick={()=>{
                router.push({pathname:router.pathname,query:{...router.query, linksIndex:index}})}}>{text}</div>
        </SidebarButton>
    )
}