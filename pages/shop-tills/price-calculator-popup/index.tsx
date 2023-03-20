import DatabaseSearchBar from "../../../components/database-search-bar/database-search";
import {useEffect, useState} from "react";
import {marginTestItem, MarginTestTemplate} from "../../margin-calculator/margin-test";
import RegexInput from "../../../components/regex-input";
import {currencyToLong, toCurrency, toCurrencyInput} from "../../../components/utils/utils";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import styles from "./popup.module.css";
import {generateMarginText, textColourStyler} from "../../../components/margin-calculator-utils/margin-styler";

export default function ShopPriceCalculator() {

    const [item, setItem] = useState<MarginTestTemplate>(marginTestItem())
    const [sku, setSku] = useState<string | undefined>()

    useEffect(() => {
        if (!sku) return
        const opts = {method: "POST", body: sku}
        fetch("/api/items/get-item", opts)
            .then(res => res.json())
            .then(dbItem => setItem({...dbItem, discount: 0, test: true}))
    }, [sku])

    useEffect(() => {
        if (item.discounts.shop) {
            dispatchNotification({
                type: "alert",
                title: "Item Price Matched",
                content: "Item is already price matched!\n Do not discount further.",
                closeFn: () => dispatchNotification(
                    {
                        type: "popup",
                        title: "Shop Price Calculator",
                        content: <ShopPriceCalculator/>
                    }
                )
            })
        }
    }, [item])

    const updateItemPrice = async (key: "purchase" | "retail" | "discount", item: MarginTestTemplate, value: string) => {
        const newItem = structuredClone(item)

        key === "discount"
            ? newItem.discount = parseInt(value)
            : newItem.prices[key] = currencyToLong(value)

        let opts = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newItem)}
        let result = await fetch("/api/margin/test-item", opts)

        setItem(await result.json())
    }

    return <div>
        <div className={styles.table}>
            <DatabaseSearchBar handler={(value) => setSku(value.SKU)}
                               searchOptions={{isListingVariation: false}}/>
            <div className={styles["price-table"]}>
                {sku ? <div>SKU: {sku}</div> : <div>Test Item</div>}
                <div className={styles["price-inputs"]}>
                    <div>
                        <div>Purchase Price:</div>
                        <RegexInput
                            errorMessage={"Numbers only!"}
                            handler={(value) => updateItemPrice("purchase", item, value)}
                            type={"decimal"}
                            value={toCurrencyInput(item.prices.purchase)}
                        />
                    </div>
                    <div>
                        <div>Retail Price:</div>
                        <RegexInput
                            errorMessage={"Numbers only!"}
                            handler={(value) => updateItemPrice("retail", item, value)}
                            type={"decimal"}
                            value={toCurrencyInput(item.prices.retail)}
                        />
                    </div>
                    <div>
                        <div>Discount:</div>
                        <RegexInput
                            errorMessage={"Whole numbers only!"}
                            handler={(value) => updateItemPrice("discount", item, value)}
                            type={"number"}
                            value={item.discount}
                        />
                    </div>
                </div>
            </div>
            <div className={styles["results-table"]}>
                <div>Results</div>
                <TitleRow/>
                <ItemRow item={item}/>
            </div>
        </div>
    </div>
}

function TitleRow() {
    return <div className={styles["results-row"]}>
        <div>Price</div>
        <div>Discount</div>
        <div>Margin with Discount</div>
        <div>Margin without</div>
    </div>
}

function ItemRow({item}: { item: MarginTestTemplate }) {

    const [discountTextClass, setDiscountTextClass] = useState("")
    const [marginTextClass, setMarginTextClass] = useState("")

    const profit = item.marginData.shop.profit
    const price = item.prices.shop

    useEffect(() => {
        setMarginTextClass(styles[textColourStyler(profit)])
        if (profit) setDiscountTextClass(styles[textColourStyler(profit - calculateDiscount())])
    }, [profit, price, item])

    function calculateDiscount() {
        if (!item.discount) return 0
        let discountedPrice = price * (1 - (item.discount / 100))
        return price - discountedPrice
    }

    return <div className={styles["results-row"]}>
        <div>{toCurrency(item.prices.shop - calculateDiscount())}</div>
        <div>{toCurrency(calculateDiscount())}</div>
        <div className={discountTextClass}>
            {profit ? generateMarginText(item.prices.purchase, profit - calculateDiscount()) : 0}
        </div>
        <div className={marginTextClass}>{generateMarginText(item.prices.purchase, profit)}</div>
    </div>
}