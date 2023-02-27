import styles from "../sales-report.module.css";
import LocationSelect from "./location-select";
import YearSummaries from "./year-summaries";
import {useRouter} from "next/router";
import YearSelect from "./year-select";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import TillTransactionCSVPopup from "../till-transaction-csv-popup";
import SidebarButton from "../../../../components/layouts/sidebar-button";

export default function SalesSidebar(){
    let router = useRouter()
    let location = router.query.location || "shop"
    let year = router.query.year || new Date().getFullYear()

    return <div className={styles.sidebar}>
        <div className={styles["sidebar-select-container"]}>
            <LocationSelect/>
            <YearSelect />
        </div>
        {year ? <YearSummaries/> : null}
        {location === "shop" ?
            <SidebarButton onClick={() => dispatchNotification({
                type: "popup",
                title: "Till Transaction CSV",
                content: <TillTransactionCSVPopup/>
            })}>Till Transaction CSV</SidebarButton>
            : null
        }
    </div>
}