export function toCurrency(value?:number){
    return value ? `£${(value / 100).toLocaleString("en-GB", {minimumFractionDigits: 2, maximumFractionDigits:2})}` : "£0.00"
}

export function toCurrencyInput(value?:number){
    return value ? (value / 100).toFixed(2) : 0
}

export function currencyToLong(value?:number | string | undefined){
    if(!value) return 0
    if(typeof value === "string") value = parseFloat(value)
    return Math.round(value * 100)
}

export function toTitleCase(string?:string){
    return string
        ? string.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() })
        : "";
}

// Function from Data-Processing-Server - margin-calculation.ts - converts a number to the nearest 0.05 or 0.99
export const roundToNearest = (num: number):number => {

    let rounded = Math.round(num)
    let decimal = rounded % 100
    let whole = rounded - decimal

    let decimalRound = whole < 500
        ? (Math.ceil(decimal / 100 * 20) / 20) * 100
        : (Math.ceil(decimal / 100 * 4) / 4) * 100

    if (decimalRound === 0) return whole + decimalRound - 1
    if (decimalRound > 90) return whole + 99

    return Math.round(whole + decimalRound)
}