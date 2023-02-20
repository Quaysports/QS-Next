import SidebarButton from "../../../components/layouts/sidebar-button";
import styles from "../item-database.module.css";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import {selectItem} from "../../../store/item-database/item-database-slice";
import {useSelector} from "react-redux";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import BrandLabelPopUp from "./sidebar-components/brand-label-popup";
import NewTagPopUp from "./sidebar-components/new-tag-popup";
import ImportDetailsPopUp from "./sidebar-components/import-details-popup";
import {schema} from "../../../types";
import JariloTemplatePopup from "./sidebar-components/jarilo-template-popup";
import uploadToLinnworksHandler from "./sidebar-components/linnworks-upload-function";

export default function SideBar() {

    const item = useSelector(selectItem)

    function print(id: string, item: schema.Item) {
        window.localStorage.setItem("item", JSON.stringify(item))
        window.open("/print?app=item-database&print=" + id, "_blank", "width=515,height=580")
    }

    return (
        <SidebarLayout>
            <div className={styles["sidebar-button-container"]}>
                <SidebarButton onClick={() =>
                    print("barcode", item)}>
                    Barcode
                </SidebarButton>
                <SidebarButton onClick={() =>
                    print("tag", item)}>
                    Tag
                </SidebarButton>
                <SidebarButton onClick={() => {
                    print("shelf-tag", item)
                }}>
                    Shelf Tag
                </SidebarButton>
                <SidebarButton onClick={() => {
                    print("rod-tag", item)
                }}>
                    Rod Tag
                </SidebarButton>
                <SidebarButton className={styles["upload-button"]}  onClick={() => uploadToLinnworksHandler(item)}>
                    Upload to Linnworks
                </SidebarButton>
                <SidebarButton onClick={() => dispatchNotification({
                    type: "popup",
                    title: "Jarilo Template",
                    content: <JariloTemplatePopup/>
                })}>
                    Jarilo Template
                </SidebarButton>
                <SidebarButton onClick={() => dispatchNotification({
                    type: 'popup',
                    title: 'Import Details from SKU',
                    content: <ImportDetailsPopUp/>
                })}>
                    Import Details
                </SidebarButton>
                <SidebarButton onClick={() => dispatchNotification({
                    type: "popup",
                    title: "Brand Label",
                    content: <BrandLabelPopUp print={(id: string, item: schema.Item) => print(id, item)}/>
                })}>
                    Branded Labels
                </SidebarButton>
                <SidebarButton onClick={() => dispatchNotification({
                    type: "popup",
                    title: "New Tag",
                    content: <NewTagPopUp/>
                })}>
                    Create New Tag
                </SidebarButton>
            </div>
        </SidebarLayout>
    )
}