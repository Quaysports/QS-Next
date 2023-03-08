import styles from "../sales-report.module.css";
import {useRouter} from "next/router";
import MonthTable from "./month-table";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import {useEffect} from "react";
import ShopYearTable from "./shop-table";
import OnlineYearTable from "./online-table";

export default function SalesReportTable() {
    const router = useRouter()
    const month = router.query.month
    const location = router.query.location ?? "shop"

    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            dispatchNotification({type:"loading", content:"Loading report"})
        })
    })

    useEffect(() => dispatchNotification())

    return (
        <div className={styles["table-container"]}>
            {location === "shop"
                ? !month
                    ? <ShopYearTable/>
                    : <MonthTable/>
                : !month
                    ? <OnlineYearTable/>
                    : <MonthTable/>
            }
        </div>
    )
}