import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarSelect from "../../../components/layouts/sidebar-select";
import {useRouter} from "next/router";
import React, {ChangeEvent} from "react";
import styles from "./todo.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function TodoSideBar() {

    const router = useRouter();

    const channelHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatchNotification({type: 'loading', content: "Loading, please wait"})
        router.push({
            pathname: router.pathname,
            query: {...router.query, channel: event.target.value},
        })
    }

    const statusHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatchNotification({type: 'loading', content: "Loading, please wait"})
        router.push({
            pathname: router.pathname,
            query: {...router.query, status: event.target.value},
        })
    }

    const onResetHandler = () => {
        dispatchNotification({type: 'loading', content: "Loading, please wait"})
        router.push({
            pathname: router.pathname,
            query: {tab: "to-do"}
        })
    }

    return (
        <SidebarLayout>
            <SidebarSelect
                onChange={(e) =>
                    channelHandler(e)
                }>
                <option value={""}>All Channels</option>
                <option value={"amazon"}>Amazon</option>
                <option value={"ebay"}>Ebay</option>
                <option value={"magento"}>Magento</option>
            </SidebarSelect>
            <SidebarSelect
                onChange={(e) =>
                    statusHandler(e)
                }>
                <option value={""}>All Statuses</option>
                <option value={"ready"}>Ready</option>
                <option value={"done"}>Done</option>
            </SidebarSelect>
            <div className={styles["button-container"]}>
                <button onClick={() => onResetHandler()}>Reset</button>
            </div>
        </SidebarLayout>
    )
}
