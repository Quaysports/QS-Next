import { MarginItem } from "../../store/margin-calculator-slice";
import { useEffect, useState } from "react";
import styles from "../../pages/margin-calculator/margin-calculator.module.css";
import { generateMarginText, textColourStyler } from "../../components/margin-calculator-utils/margin-styler";
import { dispatchNotification } from "../../components/notification/dispatch-notification";
import { toCurrency } from "../../components/utils/utils";

type Platform = 'amazon' | 'magento' | 'ebay' | 'onbuy v2';

type MarginCellProps = {
    item: MarginItem;
    platform: Platform;
    tooltipTitle: string;
};

export default function MarginCell({ item, platform, tooltipTitle }: MarginCellProps) {
    const [textClass, setTextClass] = useState("");
    const [marginText, setMarginText] = useState<string>("");

    useEffect(() => {
        const marginData = item.marginData[platform];
        setTextClass(styles[textColourStyler(marginData.profit)]);
        setMarginText(generateMarginText(item.prices.purchase, marginData.profit));
    }, [item, platform]);

    if (!item) return null;

    return (
        <span
            className={textClass}
            onMouseOver={(e) => {
                if (!item.prices[platform]) return;
                dispatchNotification({
                    type: "tooltip",
                    title: tooltipTitle,
                    content: buildMarginTooltip(item, platform),
                    e: e
                });
            }}
            onMouseLeave={() => dispatchNotification({ type: undefined })}
        >
            {marginText}
        </span>
    );
}

function buildMarginTooltip(item: MarginItem, platform: Platform) {
    const { postage, packaging, [platform]: platformData } = item.marginData;
    const { fees, profit, salesVAT } = platformData;

    return (
        <div className={styles.tooltip}>
            <div>Selling Price: {toCurrency(item.prices[platform])}</div>
            <div>------- Minus -------</div>
            <div>Purchase Price: {toCurrency(item.prices.purchase)}</div>
            {item.prices[platform] > 25 && (
                <>
                    <div>Postage: {toCurrency(postage)}</div>
                    <div>Packaging: {toCurrency(packaging)}</div>
                </>
            )}
            <div>VAT: {toCurrency(salesVAT)}</div>
            <div>Channel Fees: {toCurrency(fees)}</div>
            <div>------- Equals -------</div>
            <div>Profit: {toCurrency(profit)}</div>
        </div>
    );
}
