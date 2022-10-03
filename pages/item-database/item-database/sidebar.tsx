import SidebarButton from "../../../components/layouts/SidebarButton";
import styles from "../item-database.module.css";
import SidebarLayout from "../../../components/layouts/sidebar-layout";

export default function SideBar(){
    return(
        <SidebarLayout>
            <div className={styles["sidebar-button-container"]}>
            <SidebarButton onClick={() => null}>
                Barcode
            </SidebarButton>
            <SidebarButton onClick={() => null}>
                Tag
            </SidebarButton>
            <SidebarButton onClick={() => null}>
                Shelf Tag
            </SidebarButton>
            <SidebarButton className={styles["upload-button"]}  onClick={() => null}>
                Upload to Linnworks
            </SidebarButton>
            <SidebarButton onClick={() => null}>
                Jarilo Template
            </SidebarButton>
            <SidebarButton onClick={() => null}>
                Import Details
            </SidebarButton>
            <SidebarButton onClick={() => null}>
                Branded Labels
            </SidebarButton>
            </div>
        </SidebarLayout>
    )
}