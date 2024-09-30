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