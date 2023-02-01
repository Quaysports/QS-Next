import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import MarginCalculatorFilters from "./filter-popup";
import SidebarButton from "../../../components/layouts/sidebar-button";
import {useRouter} from "next/router";
import styles from './popup-styles.module.css'
import FeesMenu from "./fees-popup";
import PostageMenu from "./postage-popup";
import PackagingMenu from "./packaging-popup";

export interface MenuState{
    updateRequired:boolean
    handler: () => void
}
export default function MarginMenu() {

    const router = useRouter()

    const updateAllItemData = async() =>{
        dispatchNotification({type: "loading", title: "Updating all Items"})

        const opt = {method: 'POST', headers: {"Content-Type": "application/json"}}
        await fetch('/api/items/update-all', opt)

        menuState.updateRequired = false

        dispatchNotification()
        router.reload()
    }

    const updateAllMarginData = async() =>{
        dispatchNotification({type: "loading", title: "Running Margin Calculations"})

        const opt = {method: 'POST', headers: {"Content-Type": "application/json"}}
        await fetch('/api/margin/update', opt)

        menuState.updateRequired = false

        dispatchNotification()
        router.reload()
    }

    const uploadLinnworksPrices = async()=>{
        dispatchNotification({type: "loading", title: "Uploading prices to Linnworks"})

        const opts = {method: 'POST', headers: {"Content-Type": "application/json"}}
        await fetch("/api/linnworks/update-channel-prices", opts)

        dispatchNotification()
    }

    const menuState:MenuState = {
        updateRequired:false,
        handler: ()=> {
            if(menuState.updateRequired) updateAllMarginData()
        }
    }

    return <div className={styles.menu}>
        <div>
            <span>Options</span>
            <SidebarButton onClick={() => dispatchNotification({
                type: "popup",
                title: "Filters",
                content: <MarginCalculatorFilters/>
            })}>Filters</SidebarButton>
        </div>
        <div>
            <span>Sub-menus</span>
            <SidebarButton onClick={() => dispatchNotification({
                type: "popup",
                title: "Fees Menu",
                content: <FeesMenu menuState={menuState}/>,
                closeFn:menuState.handler
            })}>Fees</SidebarButton>
            <SidebarButton onClick={() => dispatchNotification({
                type: "popup",
                title: "Postage Menu",
                content: <PostageMenu menuState={menuState}/>,
                closeFn:menuState.handler
            })}>Postage</SidebarButton>
            <SidebarButton onClick={() => dispatchNotification({
                type: "popup",
                title: "Packaging Menu",
                content: <PackagingMenu menuState={menuState}/>,
                closeFn:menuState.handler
            })}>Packaging</SidebarButton>
        </div>
        <div>
            <span>Bulk updates</span>
            <SidebarButton onClick={async () => updateAllItemData() }>Update All Items</SidebarButton>
            <SidebarButton onClick={async () => updateAllMarginData() }>Update All Margins</SidebarButton>
            <SidebarButton onClick={async () => uploadLinnworksPrices() }>Update All Channel Prices</SidebarButton>
            <span/>
            <SidebarButton onClick={async () => {
                dispatchNotification({type: "loading", title: "Removing Overrides"})
                await fetch("/api/margin/remove-overrides")
                router.reload()
            }}>Remove All Overrides</SidebarButton>
            <SidebarButton onClick={async () => {
                dispatchNotification({type: "loading", title: "Un-hiding All"})
                await fetch("/api/margin/unhide-all")
                router.reload()
            }}>Un-hide All</SidebarButton>
        </div>
    </div>
}