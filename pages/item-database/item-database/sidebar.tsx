import SidebarButton from "../../../components/layouts/sidebar-button";
import styles from "../item-database.module.css";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import {selectItem} from "../../../store/item-database/item-database-slice";
import {useSelector} from "react-redux";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import BrandLabelPopUp from "./sidebar-components/brand-label-popup";
import LinnworksUploadButton from "./sidebar-components/linnworks-upload-button";
import NewTagPopUp from "./sidebar-components/new-tag-popup";
import ImportDetailsPopUp from "./sidebar-components/import-details-popup";
import {jariloHtml} from "../../../components/jarilo-template";

/**
 * Side Bar Component
 */
export default function SideBar() {

    const item = useSelector(selectItem)

    function print(id: string, item: schema.Item) {
        window.localStorage.setItem("item", JSON.stringify(item))
        window.open("/print?app=item-database&print=" + id, "_blank", "width=515,height=580")
    }

    async function copyJariloTemplate(item:schema.Item){
        let template = jariloHtml(item.description, `${item.SKU}/${item.images.main.filename}`, item.webTitle)
        await navigator.clipboard.writeText("")
        await navigator.clipboard.writeText(template)
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
                <LinnworksUploadButton/>
                <SidebarButton onClick={() => dispatchNotification({
                    type: "popup",
                    title: "Jarilo Template",
                    content: <div><div><iframe width={"1200"} height={"600"} sandbox={'allow-same-origin'}
                                     srcDoc={jariloHtml(item.description, `${item.SKU}/${item.images.main.filename}`, item.webTitle)}/>
                    </div>
                        <button onClick={() => copyJariloTemplate(item)}>Copy Jarilo HTML</button>
                    </div>
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