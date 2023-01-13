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
        setTextClass(styles[textColourStyler(item.marginData.magentoProfitAfterVat)])
        setMarginText(generateMarginText(item.prices.purchase, item.marginData.magentoProfitAfterVat))
    }, [item])

    if(!item) return null

    return <span
        className={textClass}
        onMouseOver={(e) => {
            if (!item.prices.magento) return
            dispatchNotification({
                type: "tooltip",
                title: "Magento Margin Breakdown",
                content: buildMarginTooltip(item),
                e: e
            })
        }}
        onMouseLeave={() => dispatchNotification()}
    >{marginText}</span>
}

function buildMarginTooltip(item: MarginItem) {
    const {postageCost, packagingCost, magentoSalesVat, magentoFees, magentoProfitAfterVat} = item.marginData
    return Number(item.prices.magento) < 25
        ? <div className={styles.tooltip}>
            <div>Selling Price: £{item.prices.magento}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
            <div>Postage: {toCurrency(postageCost)}</div>
            <div>Packaging: {toCurrency(packagingCost)}</div>
            <div>VAT: {toCurrency(magentoSalesVat)}</div>
            <div>Channel Fees: {toCurrency(magentoFees)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(magentoProfitAfterVat)}</div>
        </div>
        : <div className={styles.tooltip}>
            <div>Selling Price: £{item.prices.magento}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
            <div>VAT: {toCurrency(magentoSalesVat)}</div>
            <div>Channel Fees: {toCurrency(magentoFees)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(magentoProfitAfterVat)}</div>
        </div>
}