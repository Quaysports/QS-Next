import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
function PrimeMarginCell({item}:{item:MarginItem}){

  if(!item) return null

  const [textClass, setTextClass] = useState("")
  useEffect(()=>{setTextClass(styles[textColourStyler(item.marginData.amazon.primeProfit)])},[item])

  return <span
      className={textClass}>{item.checkboxStatus.prime
      ? generateMarginText(item.prices.purchase, item.marginData.amazon.primeProfit)
      : ""
  }</span>
}

export default PrimeMarginCell