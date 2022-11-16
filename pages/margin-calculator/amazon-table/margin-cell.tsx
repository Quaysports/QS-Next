import {MarginItem} from "../../../store/margin-calculator-slice";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function MarginCell({item}:{item:MarginItem}){

    if(!item) return null

    const [textClass, setTextClass] = useState("")
    useEffect(()=>{setTextClass(styles[textColourStyler(item.MD.AMAZPAVC)])},[item])

    return <span
        className={textClass}
        onMouseOver={(e)=>{
            if(!item.AMZPRICEINCVAT || item.AMZPRICEINCVAT === "0") return
            dispatchNotification({type:"tooltip",title:"Amazon Margin Breakdown", content:buildMarginTooltip(item),e:e})
        }}
        onMouseLeave={()=>dispatchNotification({type:undefined})}
    >{ generateMarginText(item.PURCHASEPRICE, item.MD.AMAZPAVC )}</span>
}

export function PrimeMarginCell({item}:{item:MarginItem}){

    const [textClass, setTextClass] = useState("")
    useEffect(()=>{setTextClass(styles[textColourStyler(item.MD.PRIMEPAVC)])},[item])

    return <span
        className={textClass}>{item.AMZPRIME ? generateMarginText(item.PURCHASEPRICE, item.MD.PRIMEPAVC) : ""}</span>
}

function buildMarginTooltip(item:MarginItem){
    return <div className={styles.tooltip}>
        <div>Selling Price: £{item.AMZPRICEINCVAT}</div>
        <div>------- Minus -------</div>
        <div>Purchase Price: {toCurrency(item.PURCHASEPRICE)}</div>
        <div>Postage: {toCurrency(item.MD.POSTALPRICEUK)}</div>
        <div>Packaging: {toCurrency(item.MD.PACKAGING)}</div>
        <div>VAT: {toCurrency(item.MD.AMAZSALESVAT)}</div>
        <div>Channel Fees: {toCurrency(item.MD.AMAZONFEES)}</div>
        <div>------- Equals -------</div>
        <div>Profit: {toCurrency(item.MD.AMAZPAVC)}</div>
    </div>
}