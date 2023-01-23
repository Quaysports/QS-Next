import styles from "../../item-database.module.css";
import {useSelector} from "react-redux";
import {selectItem} from "../../../../store/item-database/item-database-slice";
import SidebarButton from "../../../../components/layouts/sidebar-button";

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
        fetch("/api/item-database/update-linnworks", opts)
            .then(res => console.log(res))
    }

    return (
        <SidebarButton className={styles["upload-button"]}  onClick={() => uploadToLinnworksHandler(item)}>
            Upload to Linnworks
        </SidebarButton>
    )
}