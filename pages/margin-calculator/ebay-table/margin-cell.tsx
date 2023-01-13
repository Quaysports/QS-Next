import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function MarginCell({item}:{item:MarginItem}){

    const [textClass, setTextClass] = useState("")
    const [marginText, setMarginText] = useState<string>("")

    useEffect(()=>{
        setTextClass(styles[textColourStyler(item.marginData.ebayProfitAfterVat)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.ebayProfitAfterVat ))
    },[item])

    if(!item) return null

    return <span
        className={textClass}
        onMouseOver={(e)=>{
            if(!item.prices.ebay) return
            dispatchNotification({type:"tooltip",title:"Ebay Margin Breakdown", content:buildMarginTooltip(item),e:e})
        }}
        onMouseLeave={()=>dispatchNotification({type:undefined})}
    >{marginText}</span>
}

function buildMarginTooltip(item:MarginItem){
    const {postageCost, packagingCost, ebaySalesVat, ebayFees, ebayProfitAfterVat} = item.marginData
    return <div className={styles.tooltip}>
        <div>Selling Price: £{item.prices.ebay}</div>
        <div>------- Minus -------</div>
        <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
        <div>Postage: {toCurrency(postageCost)}</div>
        <div>Packaging: {toCurrency(packagingCost)}</div>
        <div>VAT: {toCurrency(ebaySalesVat)}</div>
        <div>Channel Fees: {toCurrency(ebayFees)}</div>
        <div>------- Equals -------</div>
        <div>Profit: {toCurrency(ebayProfitAfterVat)}</div>
    </div>
}