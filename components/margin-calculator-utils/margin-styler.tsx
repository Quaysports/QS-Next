import {MarginItem} from "../../store/margin-calculator-slice";

export function textColourStyler(value: number | undefined): string {
    if(!value) return ""
    return value > 0 ? "green-text" : value < 0 ? "red-text" : "gray-text"
}

export function inputStatusColour(price: string | undefined, item: MarginItem, channel: string,): string {

    let channelData = item.CP[channel]
    let flag = item.MCOVERRIDES?.[channel]

    if (!channelData || !price) return ""

    if (!channelData.PRICE || channelData.PRICE !== price) return "price-mismatch"

    if (channelData.STATUS === 99) {
        return "listing-error"
    }
    if ((channelData.STATUS === 1 || channelData.STATUS === 2) && !flag) {
        return "listing-pending"
    }
    if (channelData.STATUS === 3 || channelData.STATUS === 5 || flag) {
        return "listing-success"
    }
    if (!channelData.STATUS && channelData.ID) {
        return "listing-success"
    }

    return ""
}

export function generateMarginText(purchasePrice:number, profitAfterVAT:number | undefined){
    let marginPercentage = purchasePrice !== 0 && profitAfterVAT
        ? (100 / purchasePrice) * profitAfterVAT
        : 0;
    return `£${profitAfterVAT
        ? profitAfterVAT.toFixed(2)
        : (0).toFixed(2)} | ${marginPercentage.toFixed(0)}%`
}