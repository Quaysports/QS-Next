import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import styles from "../margin-calculator.module.css";
import {generateMarginText, textColourStyler} from "../margin-styler";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

export default function MarginCell({item}: { item: MarginItem }) {

    const [textClass, setTextClass] = useState("")
    useEffect(() => {
        setTextClass(styles[textColourStyler(item.MD.QSPAVC)])
    }, [item])

    return <span
        className={textClass}
        onMouseOver={(e) => {
            if (!item.QSPRICEINCVAT || item.QSPRICEINCVAT === "0") return
            dispatchNotification({
                type: "tooltip",
                title: "Magento Margin Breakdown",
                content: buildMarginTooltip(item),
                e: e
            })
        }}
        onMouseLeave={() => dispatchNotification({type: undefined})}
    >{generateMarginText(item.PURCHASEPRICE, item.MD.QSPAVC)}</span>
}

function buildMarginTooltip(item: MarginItem) {

    function toCurrency(value?: number) {
        return value ? `£${value.toFixed(2)}` : "£0.00"
    }

    return Number(item.QSPRICEINCVAT) < 25
        ? <div className={styles.tooltip}>
            <div>Selling Price: £{item.QSPRICEINCVAT}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.PURCHASEPRICE)}</div>
            <div>Postage: {toCurrency(item.MD.POSTALPRICEUK)}</div>
            <div>Packaging: {toCurrency(item.MD.PACKAGING)}</div>
            <div>VAT: {toCurrency(item.MD.QSUKSALESVAT)}</div>
            <div>Channel Fees: {toCurrency(item.MD.QSFEES)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(item.MD.QSPAVC)}</div>
        </div>
        : <div className={styles.tooltip}>
            <div>Selling Price: £{item.QSPRICEINCVAT}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.PURCHASEPRICE)}</div>
            <div>VAT: {toCurrency(item.MD.QSUKSALESVAT)}</div>
            <div>Channel Fees: {toCurrency(item.MD.QSFEES)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(item.MD.QSPAVC)}</div>
        </div>
}