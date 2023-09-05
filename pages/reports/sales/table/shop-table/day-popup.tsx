import { ShopDayTotal } from "../../../../../server-modules/reports/reports";
import styles from "../../sales-report.module.css";
import { toCurrency } from "../../../../../components/utils/utils";

export default function DayPopup({ data }: { data: ShopDayTotal }) {
  if (!data) return null;
  console.log(data);

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
          <div>Cash Returns:</div>
          <div>{toCurrency(data.cashReturns)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Card Returns:</div>
          <div>{toCurrency(data.cardReturns)}</div>
        </div>
        <div className={styles["day-row"]}>
          <div>Net Profit:</div>
          <div>{toCurrency(data.totalProfitWithLoss)}</div>
        </div>
      </div>
      <DiscountsTable discounts={data.discounts} />
    </div>
  );
}

function DiscountsTable({
  discounts,
}: {
  discounts: ShopDayTotal["discounts"];
}) {
  let discountRows = [
    <div className={styles["discount-row"]}>
      <div>Order id</div>
      <div>By</div>
      <div>Reason</div>
      <div>Flat</div>
      <div>Percentage</div>
      <div>Total</div>
      <div>Gross Total</div>
      <div>Net Total</div>
    </div>,
  ];
  if (discounts && discounts.length > 0) {
    for (let discount of discounts) {
      let discountTotal =
        (discount.flatDiscount || 0) + (discount.percentageDiscountAmount || 0);
      discountRows.push(
        <section>
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
        </section>
      );
    }
  }

  return <div className={styles["day-discounts"]}>{discountRows}</div>;
}
