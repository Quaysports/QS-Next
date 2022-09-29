import SidebarButton from "../../../components/layouts/SidebarButton";
import styles from "../item-database.module.css";
import SidebarLayout from "../../../components/layouts/sidebar-layout";

export default function SideBar(){
    return(
        <SidebarLayout>
            <div className={styles["sidebar-button-container"]}>
            <SidebarButton>
                Barcode
            </SidebarButton>
            <SidebarButton>
                Tag
            </SidebarButton>
            <SidebarButton>
                Shelf Tag
            </SidebarButton>
            <SidebarButton className={styles["upload-button"]}>
                Upload to Linnworks
            </SidebarButton>
            <SidebarButton>
                Jarilo Template
            </SidebarButton>
            <SidebarButton>
                Import Details
            </SidebarButton>
            <SidebarButton>
                Branded Labels
            </SidebarButton>
            </div>
        </SidebarLayout>
    )
}