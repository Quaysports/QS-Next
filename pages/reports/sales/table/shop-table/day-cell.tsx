import { useSelector } from "react-redux";
import { selectShopDayTotals } from "../../../../../store/reports/sales-slice";
import styles from "../../sales-report.module.css";
import { dispatchNotification } from "../../../../../components/notification/dispatch-notification";
import { ShopDayTotal } from "../../../../../server-modules/reports/reports";
import { toCurrency } from "../../../../../components/utils/utils";
import DayPopup from "./day-popup";

export default function ShopDay({
  month,
  date,
}: {
  month: number;
  date: Date;
}) {
  const dayTotals = useSelector(selectShopDayTotals);
  if (!dayTotals || !date) return null;

  let data = dayTotals.find(
    (day) => day.date === date.toISOString().split("T")[0]
  );

  let style = `${styles.day} ${
    date.getMonth() !== month ? styles["inactive-day"] : ""
  }`;
  let title = date.toLocaleDateString("en-GB");
  return (
    <div
      className={style}
      onClick={() => {
        if (!data) return null;
        dispatchNotification({
          type: "popup",
          title: title,
          content: <DayPopup data={data} />,
        });
      }}
    >
      <div className={styles["day-title"]}>{title}</div>
      <DayContent data={data} />
    </div>
  );
}

function DayContent({ data }: { data: ShopDayTotal | undefined }) {
  if (!data) return null;

  return (
    <div className={styles["day-container"]}>
      <div className={styles["day-row"]}>
        <div>Cash:</div>
        <div>{toCurrency(data.totalCash)}</div>
      </div>
      <div className={styles["day-row"]}>
        <div>Card:</div>
        <div>{toCurrency(data.totalCard)}</div>
      </div>
      <div className={styles["day-row"]}>
        <div>Total:</div>
        <div>{toCurrency(data.totalGrandTotal)}</div>
      </div>
      <div className={styles["day-row"]}>
        <div>Net Profit:</div>
        <div>{toCurrency(data.totalProfitWithLoss)}</div>
      </div>
      <div className={styles["day-row"]}>
        <div>Card Returns:</div>
        <div>{toCurrency(data.cardReturns)}</div>
      </div>
      <div className={styles["day-row"]}>
        <div>Cash Returns:</div>
        <div>{toCurrency(data.cashReturns)}</div>
      </div>
    </div>
  );
}
