import { ShopDayTotal } from "../../../../../server-modules/reports/reports";
import styles from "../../sales-report.module.css";
import { toCurrency } from "../../../../../components/utils/utils";

export default function DayPopup({ data }: { data: ShopDayTotal }) {
  if (!data) return null;

  let tillTakings = [];
  if (data.till && data.till.length > 0) {
    for (let till of data.till) {
      tillTakings.push(
        <div key={till.id} className={styles["day-row"]}>
          <div>{till.id}:</div>
          <div>{toCurrency(till.amount)}</div>
        </div>
      );
    }
  }

  return (
    <div className={styles["day-popup-container"]}>
      <div className={styles["day-takings"]}>
        <div className={styles["day-row"]}>
          <div>Cash:</div>
          <div>{toCurrency(data.totalCash)}</div>
        </div>
        {tillTakings}
        <div className={styles["day-row"]}>
          <div>Card:</div>
          <div>{toCurrency(data.totalCard)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Total:</div>
          <div>{toCurrency(data.totalGrandTotal)}</div>
        </div>
      </div>
      <div className={styles["day-totals"]}>
        <div className={styles["day-row"]}>
          <div>Gross Profit:</div>
          <div>{toCurrency(data.totalProfit)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Discounts:</div>
          <div>{toCurrency(data.totalDiscount)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Gift Card:</div>
          <div>{toCurrency(data.totalGiftCardDiscount)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Returns:</div>
          <div>{toCurrency(data.returnsTotal)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Net Profit:</div>
          <div>{toCurrency(data.totalProfitWithLoss)}</div>
        </div>
      </div>
        <DiscountsTable discounts={data.discounts} />
        {data.returns.length > 0 && <ReturnsTable returns={data.returns}/>}
    </div>
  );
}

function DiscountsTable({
  discounts,
}: {
  discounts: ShopDayTotal["discounts"];
}) {
  let discountRows = [
    <div>
      <div id={styles["title"]}>
        <h3>Discounts</h3>
      </div>
      <div className={styles["discount-row"]}>
        <div>Order id</div>
        <div>By</div>
        <div>Reason</div>
        <div>Flat</div>
        <div>Percentage</div>
        <div>Total</div>
        <div>Gross Total</div>
        <div>Net Total</div>
      </div>
    </div>
  ];
  if (discounts && discounts.length > 0) {
    for (let discount of discounts) {
      let discountTotal =
        (discount.flatDiscount || 0) + (discount.percentageDiscountAmount || 0);
      discountRows.push(
        <div key={discount.id} className={styles["discount-row"]}>
          <div>{discount.id}</div>
          <div>{discount.name}</div>
          <div>{discount.discountReason}</div>
          <div>{toCurrency(discount.flatDiscount)}</div>
          <div>
            {toCurrency(discount.percentageDiscountAmount)} [
            {discount.percentageDiscount}%]
          </div>
          <div>{toCurrency(discountTotal)}</div>
          <div>{toCurrency(discount.grandTotal + discountTotal)}</div>
          <div>{toCurrency(discount.grandTotal)}</div>
        </div>
      );
    }
  }

  return <div className={styles["day-discounts"]}>{discountRows}</div>;
}

function ReturnsTable({
  returns
}: {
  returns: ShopDayTotal["returns"];
}) {
  let returnsRows = [
    <div>
      <div id={styles["title"]}>
        <h3>Returns</h3>
      </div>
      <div className={styles["returns-row"]}>
        <div>Order id</div>
        <div>By</div>
        <div>Reason</div>
        <div>Type</div>
        <div>Quantity</div>
        <div>Refunded</div>
        <div>SKU</div>
      </div>
    </div>
  ];
  if (returns && returns.length > 0) {
    for (let itemReturn of returns) {
      returnsRows.push(
        <div key={itemReturn.id} className={styles["returns-row"]}>
          <div>{itemReturn.id}</div>
          <div>{itemReturn.user}</div>
          <div>{itemReturn.returnReason}</div>
          <div>{itemReturn.transactionType}</div>
          <div>{itemReturn.returnQuantity}</div>
          <div>{toCurrency(itemReturn.transactionTotal)}</div>
          <div>{itemReturn.itemSku.join(", ")}</div>
        </div>
      );
    }
  }
  return <div className={styles["day-returns"]}>{returnsRows}</div>;
}