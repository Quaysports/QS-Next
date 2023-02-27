import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/utils/utils";

export default function MarginCell({item}: { item: MarginItem }) {

    const [textClass, setTextClass] = useState("")
    const [marginText, setMarginText] = useState<string>("")

    useEffect(() => {
        setTextClass(styles[textColourStyler(item.marginData.shop.profit)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.shop.profit))
    }, [item])

    if(!item) return null

    return <span
        className={textClass}
        onMouseOver={(e) => {
            if (!item.prices.shop) return
            dispatchNotification({
                type: "tooltip",
                title: "Shop Margin Breakdown",
                content: buildMarginTooltip(item),
                e: e
            })
        }}
        onMouseLeave={() => dispatchNotification()}
    >{marginText}</span>
}

function buildMarginTooltip(item: MarginItem) {
    const {fees, salesVAT, profit} = item.marginData.shop
    return <div className={styles.tooltip}>
            <div>Selling Price: {toCurrency(item.prices.shop)}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
            <div>VAT: {toCurrency(salesVAT)}</div>
            <div>Channel Fees: {toCurrency(fees)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(profit)}</div>
        </div>
}