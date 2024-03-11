import {
  MarginItem,
  selectActiveIndex,
} from "../../../store/margin-calculator-slice";
import { useEffect, useRef, useState } from "react";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";
import { inputStatusColour } from "../../../components/margin-calculator-utils/margin-styler";
import MarginCell from "./margin-cell";
import { useRouter } from "next/router";
import {
  currencyToLong,
  toCurrency,
  toCurrencyInput,
} from "../../../components/utils/utils";
import { useSelector } from "react-redux";
import RegexInput from "../../../components/regex-input";

export default function ItemRow({
  item,
  index,
}: {
  item: MarginItem;
  index: string;
}) {
  const router = useRouter();
  const domestic = router.query.domestic === "true";
  const specialPriceInputRef = useRef<HTMLInputElement>(null);
  const magentoPriceInputRef = useRef<HTMLInputElement>(null);
  const updateItem = useUpdateItemAndCalculateMargins();

  const [inputClass, setInputClass] = useState("");

  useEffect(() => {
    if (!magentoPriceInputRef.current) return
    magentoPriceInputRef.current.value = String(toCurrencyInput(item.prices.magento))
    setInputClass(styles[inputStatusColour(item, "magento",)])
}, [item])

  useEffect(() => {
    if (!specialPriceInputRef.current) return;
    specialPriceInputRef.current.value = String(toCurrencyInput(item.prices.magentoSpecial));
    setInputClass(styles[inputStatusColour(item, "magento")]);
  }, [item]);

  const activeIndex = useSelector(selectActiveIndex);
  const [classes, setClasses] = useState(cssClasses());

  useEffect(() => {
    setClasses(cssClasses());
    if (!specialPriceInputRef.current) return;
    specialPriceInputRef.current.value = String(toCurrencyInput(item.prices.magentoSpecial));
    setInputClass(styles[inputStatusColour(item, "magento")]);
  }, [activeIndex, domestic]);

  useEffect(() => {
    setClasses(cssClasses());
    if (!magentoPriceInputRef.current) return;
    magentoPriceInputRef.current.value = String(toCurrencyInput(item.prices.magento));
    setInputClass(styles[inputStatusColour(item, "magento")]);
  }, [activeIndex, domestic]);


  function cssClasses() {
    let classes = styles.row;
    classes += domestic
      ? ` ${styles["magento-grid-discount"]}`
      : ` ${styles["magento-grid"]}`;
    classes += activeIndex === index ? ` ${styles["active"]}` : "";
    return classes;
  }

  async function discountHandler(value: string) {
    await updateItem(item, "discounts", {
      ...item.discounts,
      magento: Math.round(Number(value)),
    });
  }

  async function updateSpecialPrice(value: string) {
    await updateItem(item, "mappedExtendedProperties", {
      ...item.mappedExtendedProperties,
      specialPrice: value.toString(),
    });
  }

  if (!item) return null;

  return (
    <div key={item.SKU} className={classes}>
      {domestic ? <div>
      <button
      disabled={item.prices.magento === item.prices.retail}
        onClick={async () => {
          const update = {
            ...item.prices,
            magento: item.prices.retail,
          };
          await updateItem(item, "prices", update);
        }}
      >{'\u238C'}</button>
      </div> : null}
      <div>
        <input
          ref={magentoPriceInputRef}
          className={inputClass}
          defaultValue={toCurrencyInput(item.prices.magento)}
          onBlur={async (e) => {
            const update = {
              ...item.prices,
              magento: currencyToLong(e.target.value),
            };
            await updateItem(item, "prices", update);
          }}
        />
      </div>
      {domestic ? (
        <div>
          <RegexInput
            errorMessage={"Whole numbers only"}
            handler={discountHandler}
            type={"number"}
            value={item.discounts.magento}
          />
        </div>
      ) : null}
      {domestic ? (
        <span>
          {toCurrency(
            Number(item.prices.magentoSpecial) -
              Number(item.prices.magento)
          )}
        </span>
      ) : null}
        {domestic ? <div>
        <input ref={specialPriceInputRef}
            className={inputClass}
            defaultValue={toCurrencyInput(item.prices.magentoSpecial)}
            readOnly={domestic}
            onBlur={async (e) => {
                    const update = {...item.prices, magentoSpecial: currencyToLong(e.target.value)}
                    await updateItem(item, "prices", update)
            }}/>
        </div> : null}
        <MarginCell item={item} />
    </div>
  );
}