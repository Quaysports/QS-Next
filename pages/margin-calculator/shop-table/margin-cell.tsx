import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function MarginCell({item}: { item: MarginItem }) {

    const [textClass, setTextClass] = useState("")
    const [marginText, setMarginText] = useState<string>("")

    useEffect(() => {
        setTextClass(styles[textColourStyler(item.marginData.shopProfitAfterVat)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.shopProfitAfterVat))
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
    const {shopSalesVat, shopFees, shopProfitAfterVat} = item.marginData
    return <div className={styles.tooltip}>
            <div>Selling Price: £{item.prices.shop}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
            <div>VAT: {toCurrency(shopSalesVat)}</div>
            <div>Channel Fees: {toCurrency(shopFees)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(shopProfitAfterVat)}</div>
        </div>
}