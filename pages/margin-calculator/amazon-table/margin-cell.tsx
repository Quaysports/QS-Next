import {MarginItem} from "../../../store/margin-calculator-slice";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/utils/utils";

export default function MarginCell({item}:{item:MarginItem}){

    const [textClass, setTextClass] = useState("")
    const [marginText, setMarginText] = useState<string>("")

    useEffect(()=>{
        setTextClass(styles[textColourStyler(item.marginData.amazon.profit)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.amazon.profit))
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
    useEffect(()=>{setTextClass(styles[textColourStyler(item.marginData.amazon.primeProfit)])},[item])

    return <span
        className={textClass}>{item.checkboxStatus.prime
        ? generateMarginText(item.prices.purchase, item.marginData.amazon.primeProfit)
        : ""
    }</span>
}

function buildMarginTooltip(item:MarginItem){
    let {postage, packaging, amazon} = item.marginData
    let {fees, profit, salesVAT} = amazon
    return <div className={styles.tooltip}>
        <div>Selling Price: {toCurrency(item.prices.amazon)}</div>
        <div>------- Minus -------</div>
        <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
        <div>Postage: {toCurrency(postage)}</div>
        <div>Packaging: {toCurrency(packaging)}</div>
        <div>VAT: {toCurrency(salesVAT)}</div>
        <div>Channel Fees: {toCurrency(fees)}</div>
        <div>------- Equals -------</div>
        <div>Profit: {toCurrency(profit)}</div>
    </div>
}