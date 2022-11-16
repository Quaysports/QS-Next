import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function MarginCell({item}:{item:MarginItem}){

    const [textClass, setTextClass] = useState("")
    useEffect(()=>{setTextClass(styles[textColourStyler(item.MD.EBAYUKPAVC)])},[item])

    if(!item) return null

    return <span
        className={textClass}
        onMouseOver={(e)=>{
            if(!item.EBAYPRICEINCVAT || item.EBAYPRICEINCVAT === "0") return
            dispatchNotification({type:"tooltip",title:"Ebay Margin Breakdown", content:buildMarginTooltip(item),e:e})
        }}
        onMouseLeave={()=>dispatchNotification({type:undefined})}
    >{ generateMarginText(item.PURCHASEPRICE, item.MD.EBAYUKPAVC )}</span>
}

function buildMarginTooltip(item:MarginItem){
    return <div className={styles.tooltip}>
        <div>Selling Price: £{item.EBAYPRICEINCVAT}</div>
        <div>------- Minus -------</div>
        <div>Purchase Price: {toCurrency(item.PURCHASEPRICE)}</div>
        <div>Postage: {toCurrency(item.MD.POSTALPRICEUK)}</div>
        <div>Packaging: {toCurrency(item.MD.PACKAGING)}</div>
        <div>VAT: {toCurrency(item.MD.EBAYUKSALESVAT)}</div>
        <div>Channel Fees: {toCurrency(item.MD.EBAYFEES)}</div>
        <div>------- Equals -------</div>
        <div>Profit: {toCurrency(item.MD.EBAYUKPAVC)}</div>
    </div>
}