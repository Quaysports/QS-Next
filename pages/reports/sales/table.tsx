import styles from "./sales-report.module.css";
import TableMenu from "./table-menu";


export default function SalesReportTable(){
    return(
        <div className={styles["table-container"]}>
            <TableMenu/>
        </div>
    )
}