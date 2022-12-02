import {MarginItem} from "../../../store/margin-calculator-slice";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {useEffect, useState} from "react";
import styles from "./test-styles.module.css";

export default function ResultsTable({item}:{item:MarginItem}){
    return <div className={styles["results-table"]}>
        <TitleRow/>
        <ItemRow item={item} channel={"Ebay"} />
        <ItemRow item={item} channel={"Amazon"} />
        <ItemRow item={item} channel={"Quaysports"} />
        <ItemRow item={item} channel={"Shop"} />
    </div>
}

function TitleRow(){
    return <div className={styles["results-row"]}>
        <span>Channel</span>
        <div>Discount</div>
        <div>Margin with Discount</div>
        <div>Margin without</div>
    </div>
}

interface ItemRowProps{
    item:MarginItem
    channel: string
}
function ItemRow({item, channel}:ItemRowProps){

    const [discountTextClass, setDiscountTextClass] = useState("")
    const [marginTextClass, setMarginTextClass] = useState("")

    let {profit, price} = selectProfitAndPrice(item, channel)



    useEffect(()=>{
        setMarginTextClass(styles[textColourStyler(profit)])
        if(profit) setDiscountTextClass(styles[textColourStyler(profit - calculateDiscount())])
    },[profit, price, item])

    function calculateDiscount(){
        if(!item.DISCOUNT) return 0
        let discountedPrice = price * (1 - (parseFloat(item.DISCOUNT) / 100))
        return price - discountedPrice
    }

    return <div className={styles["results-row"]}>
        <span>{channel}</span>
        <div>£{calculateDiscount().toFixed(2)}</div>
        <div className={discountTextClass}>{profit ? generateMarginText(item.PURCHASEPRICE, profit - calculateDiscount()):0}</div>
        <div className={marginTextClass}>{generateMarginText(item.PURCHASEPRICE, profit)}</div>
    </div>
}

function selectProfitAndPrice(item:MarginItem, channel:string):{price:number, profit?:number}{
    switch(channel){
        case "Ebay": return {price:parseFloat(item.EBAYPRICEINCVAT), profit:item.MD.EBAYUKPAVC}
        case "Amazon": return {price:parseFloat(item.AMZPRICEINCVAT), profit:item.MD.AMAZPAVC}
        case "Quaysports": return {price:parseFloat(item.QSPRICEINCVAT), profit:item.MD.QSPAVC}
        case "Shop": return {price:parseFloat(item.SHOPPRICEINCVAT), profit:item.MD.SHOPPAVC}
        default: return {price:0}
    }
}