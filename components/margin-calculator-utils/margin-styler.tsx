import {MarginItem} from "../../store/margin-calculator-slice";

export function textColourStyler(value: number | undefined): string {
    if(!value) return ""
    return value > 0 ? "green-text" : value < 0 ? "red-text" : "gray-text"
}

export function inputStatusColour(item: MarginItem, channel: "amazon" | "ebay" | "magento" | "shop" | "onbuy v2",): string {
    let channelPrices = item.channelPrices[channel]

    let flag = item.checkboxStatus.marginCalculator[`${channel}Override` as keyof MarginItem["checkboxStatus"]["marginCalculator"]]

    if (!channelPrices || !channelPrices.price) return ""

    if (!channelPrices.price || channelPrices.price !== item.prices[channel]) return "price-mismatch"

    let index = -1
    if (item.extendedProperties) index = item.extendedProperties.findIndex(prop => prop.epName === "Special Price")
    if(!item.prices.magentoSpecial || index !== -1 && (+item.extendedProperties[index].epValue * 100).toFixed(0) !== item.prices.magentoSpecial.toString()) return "price-mismatch"

    if (channelPrices.status === 99) {
        return "listing-error"
    }
    if ((channelPrices.status === 1 || channelPrices.status === 2) && !flag) {
        return "listing-pending"
    }
    if (channelPrices.status === 3 || channelPrices.status === 5 || flag) {
        return "listing-success"
    }
    if (!channelPrices.status) {
        return "listing-success"
    }

    return ""
}

export function generateMarginText(purchasePrice:number, profitAfterVAT:number | undefined){
    let marginPercentage = purchasePrice !== 0 && profitAfterVAT
        ? (100 / purchasePrice) * profitAfterVAT
        : 0;
    return `£${profitAfterVAT
        ? (profitAfterVAT / 100).toFixed(2)
        : (0).toFixed(2)} | ${marginPercentage.toFixed(0)}%`
}