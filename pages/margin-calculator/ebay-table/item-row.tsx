import {
  MarginItem,
  selectActiveIndex,
} from "../../../store/margin-calculator-slice";
import { useEffect, useRef, useState } from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import { inputStatusColour } from "../../../components/margin-calculator-utils/margin-styler";
import MarginTestResults from "./margin-test-results";
import MarginCell from "../../../components/margin-calculator/margin-cell";
import { useSelector } from "react-redux";
import {
  currencyToLong,
  toCurrencyInput,
} from "../../../components/utils/utils";

export default function ItemRow({
  item,
  displayTest,
  index,
}: {
  item: MarginItem;
  displayTest: boolean;
  index: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateItem = useUpdateItemAndCalculateMargins();

  const [inputClass, setInputClass] = useState("");

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = String(toCurrencyInput(item.prices.ebay));
    setInputClass(styles[inputStatusColour(item, "ebay")]);
  }, [item]);

  const activeIndex = useSelector(selectActiveIndex);
  const gridClass = displayTest ? styles["ebay-grid"] : styles["ebay-grid-collapsed"]

  if (!item) return null;

  return (
    <div key={item.SKU} className={`${styles.row} ${gridClass} ${activeIndex === index ? styles.active : ''}`}>
      <div>
        <input
          ref={inputRef}
          className={inputClass}
          defaultValue={toCurrencyInput(item.prices.ebay)}
          onBlur={async (e) => {
            const update = {
              ...item.prices,
              ebay: currencyToLong(e.target.value),
            };
            await updateItem(item, "prices", update);
          }}
        />
      </div>
      {displayTest ? <MarginTestResults item={item} /> : null}
      <MarginCell
        item={item}
        platform="ebay"
        tooltipTitle="eBay Margin Breakdown"
      />
    </div>
  );
}
