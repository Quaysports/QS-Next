import styles from './rotas.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import SidebarButton from "../../../components/layouts/sidebar-button";
import CreateRota from "./create";
import {useDispatch} from "react-redux";
import {setTemplate} from "../../../store/dashboard/rotas-slice";
import PublishRota from "./publish";

export default function SplitSidebarButton({text}: { text: string }) {

    const dispatch = useDispatch()


    let opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(text)
    }


    return (
        <SidebarButton className={styles["sidebar-button"]}>
            <div className={styles["sidebar-button-edit"]} onClick={() => {
                fetch('/api/rotas/get-template', opts).then(async res => await res.json()).then(data => {
                    if (data) {
                        dispatch(setTemplate(data))
                        dispatchNotification({
                            type: "popup",
                            title: "Edit Rota Template",
                            content: <CreateRota/>
                        })
                    }
                })
            }}>&#9998;</div>
            <div className={styles["sidebar-button-title"]} onClick={() => {
                fetch('/api/rotas/get-template', opts).then(async res => await res.json()).then(data => {
                    if (data) {
                        dispatch(setTemplate(data))
                        dispatchNotification({
                            type: "popup",
                            title: "Publish Rota",
                            content: <PublishRota/>
                        })
                    }
                })
            }}>{text}</div>
        </SidebarButton>
    )
}