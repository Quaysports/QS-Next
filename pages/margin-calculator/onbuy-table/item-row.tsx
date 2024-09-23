import {
  MarginItem,
  selectActiveIndex,
} from "../../../store/margin-calculator-slice";
import { useEffect, useRef, useState } from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import { inputStatusColour } from "../../../components/margin-calculator-utils/margin-styler";
import MarginTestResults from "./margin-test-results";
import { useSelector } from "react-redux";
import {
  currencyToLong,
  toCurrencyInput,
} from "../../../components/utils/utils";
import MarginCell from "../../../components/margin-calculator/margin-cell";

// export default function ItemRow({
//   item,
//   displayTest,
//   index,
// }: {
//   item: MarginItem;
//   displayTest: boolean;
//   index: string;
// }) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const updateItem = useUpdateItemAndCalculateMargins();

//   const [inputClass, setInputClass] = useState("");

//   useEffect(() => {
//     if (!inputRef.current) return;
//     inputRef.current.value = String(toCurrencyInput(item.prices["onbuy v2"]));
//     setInputClass(styles[inputStatusColour(item, "onbuy v2")]);
//   }, [item]);

//   const activeIndex = useSelector(selectActiveIndex);
//   const gridClass = displayTest ? styles["ebay-grid"] : styles["ebay-grid-collapsed"];
  
//   return (
//     <div key={item.SKU} className={`${styles.row} ${gridClass} ${activeIndex === index ? styles.active : ''}`}>
//       <div>
//         <input
//           ref={inputRef}
//           className={inputClass}
//           defaultValue={toCurrencyInput(item.prices?.["onbuy v2"] || 0)}
//           onBlur={async (e) => {
//             const update = {
//               ...item.prices,
//               "onbuy v2": currencyToLong(e.target.value),
//             };
//             await updateItem(item, "prices", update);
//           }}
//         />
//       </div>
//       {displayTest && <MarginTestResults item={item} />}
//       <MarginCell
//         item={item}
//         platform="onbuy v2"
//         tooltipTitle="OnBuy Margin Breakdown"
//       />
//     </div>
//   );
// }

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
    if (!inputRef.current || !item?.prices?.["onbuy v2"]) return;
    inputRef.current.value = String(toCurrencyInput(item.prices["onbuy v2"]));
    setInputClass(styles[inputStatusColour(item, "onbuy v2")]);
  }, [item]);

  const activeIndex = useSelector(selectActiveIndex);
  const gridClass = displayTest ? styles["ebay-grid"] : styles["ebay-grid-collapsed"];

  // Fallbacks for undefined item or properties
  const onbuyPrice = item?.prices?.["onbuy v2"] || 0;
  const sku = item?.SKU || "Unknown SKU";

  return (
    <div
      key={sku}
      className={`${styles.row} ${gridClass} ${activeIndex === index ? styles.active : ""}`}
    >
      <div>
        <input
          ref={inputRef}
          className={inputClass}
          defaultValue={toCurrencyInput(onbuyPrice)}
          onBlur={async (e) => {
            if (!item?.prices) return; // Add safety check
            const update = {
              ...item.prices,
              "onbuy v2": currencyToLong(e.target.value),
            };
            await updateItem(item, "prices", update);
          }}
        />
      </div>
      {displayTest && <MarginTestResults item={item} />}
      <MarginCell
        item={item}
        platform="onbuy v2"
        tooltipTitle="OnBuy Margin Breakdown"
      />
    </div>
  );
}

