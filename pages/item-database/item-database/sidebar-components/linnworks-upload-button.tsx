import styles from "../../item-database.module.css";
import {useSelector} from "react-redux";
import {selectItem} from "../../../../store/item-database/item-database-slice";
import SidebarButton from "../../../../components/layouts/sidebar-button";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";

export default function LinnworksUploadButton(){

    const item = useSelector(selectItem)
    async function uploadToLinnworksHandler(item:schema.Item){
        const opts = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(item)
        }
        dispatchNotification({type:"loading"})
        fetch("/api/item-database/update-linnworks", opts)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                global.window.location.reload()
            })

    }

    return (
        <SidebarButton className={styles["upload-button"]}  onClick={() => uploadToLinnworksHandler(item)}>
            Upload to Linnworks
        </SidebarButton>
    )
}