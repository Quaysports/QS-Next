export function toCurrency(value?:number){
    return value ? `£${value.toFixed(2)}` : "£0.00"
}