import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/utils/utils";

export default function MarginCell({item}:{item:MarginItem}){

    const [textClass, setTextClass] = useState("")
    const [marginText, setMarginText] = useState<string>("")

    useEffect(()=>{
        setTextClass(styles[textColourStyler(item.marginData.ebay.profit)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.ebay.profit ))
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
    const {postage, packaging, ebay} = item.marginData
    const {fees, profit, salesVAT} = ebay
    return <div className={styles.tooltip}>
        <div>Selling Price: {toCurrency(item.prices.ebay)}</div>
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