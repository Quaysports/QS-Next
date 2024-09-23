import {
  MarginItem,
  selectActiveIndex,
} from "../../../store/margin-calculator-slice";
import { useEffect, useRef, useState } from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import { inputStatusColour } from "../../../components/margin-calculator-utils/margin-styler";
import MarginTestResults from "./margin-test-results";
import PrimeMarginCell  from "./prime-margin-cell";
import MarginCell from "../../../components/margin-calculator/margin-cell";
import { useSelector } from "react-redux";
import {
  currencyToLong,
  toCurrencyInput,
} from "../../../components/utils/utils";

export default function ItemRow({
  item,
  index,
  displayTest,
}: {
  item: MarginItem;
  index: string;
  displayTest: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateItem = useUpdateItemAndCalculateMargins();

  const [inputClass, setInputClass] = useState("");
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = String(toCurrencyInput(item.prices.amazon));
    setInputClass(styles[inputStatusColour(item, "amazon")]);
  }, [item]);

  const activeIndex = useSelector(selectActiveIndex);
  const gridClass = displayTest ? styles["amazon-grid"] : styles["amazon-grid-collapsed"]

  if (!item || !item.prices) return null;

  return (
    <div key={item.SKU} className={`${styles.row} ${gridClass} ${activeIndex === index ? styles.active : ''}`}>
      <div>
        <input
          ref={inputRef}
          className={inputClass}
          defaultValue={toCurrencyInput(item.prices.amazon)}
          onBlur={async (e) => {
            const update = {
              ...item.prices,
              amazon: currencyToLong(e.target.value),
            };
            await updateItem(item, "prices", update);
          }}
        />
      </div>
      {displayTest ? <MarginTestResults item={item} /> : null}
      <MarginCell
        item={item}
        platform="amazon"
        tooltipTitle="Amazon Margin Breakdown"
      />
      <div>
        <input
          type={"checkbox"}
          defaultChecked={item.checkboxStatus.prime}
          onChange={async (e) => {
            const update = { ...item.checkboxStatus, prime: e.target.checked };
            await updateItem(item, "checkboxStatus", update);
          }}
        />
      </div>
      <PrimeMarginCell item={item} />
    </div>
  );
}
