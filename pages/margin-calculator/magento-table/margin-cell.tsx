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
        setTextClass(styles[textColourStyler(item.MD.QSPAVC)])
        setMarginText(generateMarginText(item.PURCHASEPRICE, item.MD.QSPAVC))
    }, [item])

    if(!item) return null

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
    >{marginText}</span>
}

function buildMarginTooltip(item: MarginItem) {
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