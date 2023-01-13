import {MarginItem} from "../../../store/margin-calculator-slice";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function MarginCell({item}:{item:MarginItem}){

    const [textClass, setTextClass] = useState("")
    const [marginText, setMarginText] = useState<string>("")

    useEffect(()=>{
        setTextClass(styles[textColourStyler(item.marginData.amazonPrimeProfitAfterVat)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.amazonPrimeProfitAfterVat))
    },[item])

    if(!item) return null

    return <span
        className={textClass}
        onMouseOver={(e)=>{
            if(!item.prices.amazon) return
            dispatchNotification({type:"tooltip",title:"Amazon Margin Breakdown", content:buildMarginTooltip(item),e:e})
        }}
        onMouseLeave={()=>dispatchNotification({type:undefined})}
    >{marginText}</span>
}

export function PrimeMarginCell({item}:{item:MarginItem}){

    if(!item) return null

    const [textClass, setTextClass] = useState("")
    useEffect(()=>{setTextClass(styles[textColourStyler(item.marginData.amazonPrimeProfitAfterVat)])},[item])

    return <span
        className={textClass}>{item.checkboxStatus.prime
        ? generateMarginText(item.prices.purchase, item.marginData.amazonPrimeProfitAfterVat)
        : ""
    }</span>
}

function buildMarginTooltip(item:MarginItem){
    let {postageCost, packagingCost, amazonSalesVat, amazonFees, amazonPrimeProfitAfterVat} = item.marginData
    return <div className={styles.tooltip}>
        <div>Selling Price: £{item.prices.amazon}</div>
        <div>------- Minus -------</div>
        <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
        <div>Postage: {toCurrency(postageCost)}</div>
        <div>Packaging: {toCurrency(packagingCost)}</div>
        <div>VAT: {toCurrency(amazonSalesVat)}</div>
        <div>Channel Fees: {toCurrency(amazonFees)}</div>
        <div>------- Equals -------</div>
        <div>Profit: {toCurrency(amazonPrimeProfitAfterVat)}</div>
    </div>
}