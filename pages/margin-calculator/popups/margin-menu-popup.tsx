import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import MarginCalculatorFilters from "./filter-popup";
import SidebarButton from "../../../components/layouts/SidebarButton";
import {useRouter} from "next/router";
import styles from '../margin-calculator.module.css'
import FeesMenu from "./fees-popup";
import PostageMenu from "./postage-popup";
import PackagingMenu from "./packaging-popup";

export interface MenuState{
    updateRequired:boolean
    handler: () => void
}
export default function MarginMenu() {

    const router = useRouter()

    const updateAllMarginData = async() =>{
        console.log("update all!")
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
            <SidebarButton onClick={async () => updateAllMarginData() }>Update All Margins</SidebarButton>
            <SidebarButton onClick={async () => uploadLinnworksPrices() }>Update All Channel Prices</SidebarButton>
        </div>
    </div>
}