import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {useEffect, useState} from "react";
import styles from "./test-styles.module.css";
import {MarginTestTemplate} from "./index";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function ResultsTable({item}:{item:MarginTestTemplate}){

    if(!item) return null

    return <div className={styles["results-table"]}>
        <TitleRow/>
        <ItemRow item={item} channel={"ebay"} />
        <ItemRow item={item} channel={"amazon"} />
        <ItemRow item={item} channel={"magento"} />
        <ItemRow item={item} channel={"shop"} />
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
    item:MarginTestTemplate
    channel: "amazon" | "ebay" | "magento" | "shop"
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
        if(!item.discount) return 0
        let discountedPrice = price * (1 - (item.discount / 100))
        return price - discountedPrice
    }

    return <div className={styles["results-row"]}>
        <span>{channel}</span>
        <div>{toCurrency(calculateDiscount())}</div>
        <div className={discountTextClass}>{profit ? generateMarginText(item.prices.purchase, profit - calculateDiscount()):0}</div>
        <div className={marginTextClass}>{generateMarginText(item.prices.purchase, profit)}</div>
    </div>
}

function selectProfitAndPrice(item:MarginTestTemplate, channel:"amazon" | "ebay" | "magento" | "shop"):{price:number, profit?:number}{
    return {price:item.prices[channel], profit:item.marginData[channel].profit}
}