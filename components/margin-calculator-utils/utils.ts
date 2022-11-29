export function toCurrency(value?:number){
    return value ? `£${value.toFixed(2)}` : "£0.00"
}

export function toTitleCase(string?:string){
    return string
        ? string.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() })
        : "";
}