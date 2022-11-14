import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../margin-styler";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

export default function MarginCell({item}: { item: MarginItem }) {

    const [textClass, setTextClass] = useState("")
    useEffect(() => {
        setTextClass(styles[textColourStyler(item.MD.SHOPPAVC)])
    }, [item])

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
    >{generateMarginText(item.PURCHASEPRICE, item.MD.SHOPPAVC)}</span>
}

function buildMarginTooltip(item: MarginItem) {

    function toCurrency(value?: number) {
        return value ? `£${value.toFixed(2)}` : "£0.00"
    }

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