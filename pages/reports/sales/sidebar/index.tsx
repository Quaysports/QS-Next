import styles from "../sales-report.module.css";
import LocationSelect from "./location-select";
import YearSummaries from "./year-summaries";
import { useRouter } from "next/router";
import YearSelect from "./year-select";
import { dispatchNotification } from "../../../../components/notification/dispatch-notification";
import TillTransactionSummaryCSVPopup from "../till-transaction-summary-csv-popup";
import SidebarButton from "../../../../components/layouts/sidebar-button";
import DayToDayTillTransactionCSVPopup from "../day-to-day-till-transactions-csv-popup";

export default function SalesSidebar() {
  let router = useRouter();
  let location = router.query.location || "shop";
  let year = router.query.year || new Date().getFullYear();

  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-select-container"]}>
        <LocationSelect />
        <YearSelect />
      </div>
      {year ? <YearSummaries /> : null}
      {location === "shop" ? (
        <SidebarButton
          onClick={() =>
            dispatchNotification({
              type: "popup",
              title: "Till Transactions Summary CSV",
              content: <TillTransactionSummaryCSVPopup />,
            })
          }
        >
          Till Transactions Summary CSV
        </SidebarButton>
      ) : null}
      {location === "shop" ? (
        <SidebarButton
          onClick={() =>
            dispatchNotification({
              type: "popup",
              title: "Till Transactions CSV",
              content: <DayToDayTillTransactionCSVPopup isBait={false} />,
            })
          }
        >
          Till Transactions CSV
        </SidebarButton>
      ) : null}
      {location === "shop" ? (
        <SidebarButton
          onClick={() =>
            dispatchNotification({
              type: "popup",
              title: "Bait Till Transactions CSV",
              content: <DayToDayTillTransactionCSVPopup isBait={true} />,
            })
          }
        >
          Bait Till Transactions CSV
        </SidebarButton>
      ) : null}
    </div>
  );
}
