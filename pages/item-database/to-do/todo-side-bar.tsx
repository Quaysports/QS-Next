import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarSelect from "../../../components/layouts/sidebar-select";
import {useRouter} from "next/router";
import React, {ChangeEvent, useState} from "react";
import styles from "./todo.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useDispatch, useSelector} from "react-redux";
import {
    selectSearchedTodoItem, setSearchTerm,
    setSearchTodoItems,
} from "../../../store/item-database/to-do-slice";

export default function TodoSideBar() {
    const [userInput, setUserInput] = useState("")
    const [channelState, setChannelState] = useState("")
    const [statusState, setStatusState] = useState("")
    const router = useRouter();
    const searchedTodoItems = useSelector(selectSearchedTodoItem)
    const dispatch = useDispatch();

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
        setStatusState("");
        setChannelState("");
        dispatchNotification({type: 'loading', content: "Loading, please wait"})
        router.push({
            pathname: router.pathname,
            query: {tab: "to-do"}
        })
    }

    const handleUserInput = (searchTerm: string) => {
        setUserInput(searchTerm)
        dispatch(setSearchTerm(searchTerm))
        if (searchTerm.length > 2) {
            dispatch(setSearchTodoItems(searchTerm))
        }
    }
    return (
        <SidebarLayout>
            <SidebarSelect
                value={channelState}
                onChange={(e) => {
                    setChannelState(e.target.value)
                    channelHandler(e)
                }
                }>
                <option value={""}>All Channels</option>
                <option value={"amazon"}>Amazon</option>
                <option value={"ebay"}>Ebay</option>
                <option value={"magento"}>Magento</option>
            </SidebarSelect>
            <SidebarSelect
                value={statusState}
                onChange={(e) => {
                    setStatusState(e.target.value)
                    statusHandler(e)
                }
                }>
                <option value={""}>All Statuses</option>
                <option value={"ready"}>Ready</option>
                <option value={"done"}>Done</option>
            </SidebarSelect>
            <br/>
            <input
                value={userInput}
                placeholder="Search item SKU..."
                onChange={(e) => handleUserInput(e.target.value)}
                style={{marginLeft: "18px"}}
            />
            <div className={styles["button-container"]}>
                <button onClick={() => {
                    setUserInput("")
                    onResetHandler()
                }}>Reset</button>
            </div>
        </SidebarLayout>
    )
}