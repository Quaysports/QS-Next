import styles from "../sales-report.module.css";
import {useRouter} from "next/router";
import YearTable from "./year-table";
import MonthTable from "./month-table";

export default function SalesReportTable() {
    const router = useRouter()
    return (
        <div className={styles["table-container"]}>
            {!router.query.month
                ? <YearTable/>
                : <MonthTable/>}
        </div>
    )
}