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
        setTextClass(styles[textColourStyler(item.MD.SHOPPAVC)])
        setMarginText(generateMarginText(item.PURCHASEPRICE, item.MD.SHOPPAVC))
    }, [item])

    if(!item) return null

    return <span
        className={textClass}
        onMouseOver={(e) => {
            if (!item.SHOPPRICEINCVAT || item.SHOPPRICEINCVAT === "0") return
            dispatchNotification({
                type: "tooltip",
                title: "Shop Margin Breakdown",
                content: buildMarginTooltip(item),
                e: e
            })
        }}
        onMouseLeave={() => dispatchNotification({type: undefined})}
    >{marginText}</span>
}

function buildMarginTooltip(item: MarginItem) {
    return <div className={styles.tooltip}>
            <div>Selling Price: £{item.SHOPPRICEINCVAT}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.PURCHASEPRICE)}</div>
            <div>VAT: {toCurrency(item.MD.SHOPUKSALESVAT)}</div>
            <div>Channel Fees: {toCurrency(item.MD.SHOPFEES)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(item.MD.SHOPPAVC)}</div>
        </div>
}