import SidebarButton from "../../../components/layouts/sidebar-button";
import styles from "../item-database.module.css";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import {selectItem} from "../../../store/item-database/item-database-slice";
import {useSelector} from "react-redux";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import BrandLabelPopUp from "./sidebar-components/brand-label-popup";


/**
 * Side Bar Component
 */
export default function SideBar(){

    const item = useSelector(selectItem)

    function print(id: string){
        window.open("/print?app=item-database&print=" + id, "_blank", "width=515,height=580")
        window.localStorage.setItem("item", JSON.stringify(item))
    }

    return(
        <SidebarLayout>
            <div className={styles["sidebar-button-container"]}>
            <SidebarButton onClick={() =>
            print("barcode")}>
                Barcode
            </SidebarButton>
            <SidebarButton onClick={() =>
            print("tag")}>
                Tag
            </SidebarButton>
            <SidebarButton onClick={() => {
                print("shelf-tag")
            }}>
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
            <SidebarButton onClick={() => dispatchNotification({type:"popup", title:"Brand Label", content:<BrandLabelPopUp print={(id:string) => print(id)}/>})}>
                Branded Labels
            </SidebarButton>
            </div>
        </SidebarLayout>
    )
}