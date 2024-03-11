import RegexInput from "../../../../components/regex-input";
import {selectItem, setNewItemRetailPrice, setNewItemSpecialPrice} from "../../../../store/item-database/new-items-slice";
import {useDispatch, useSelector} from "react-redux";

type Props = {
    index:number
}
export default function RetailPriceInput({index}: Props){

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))
    function retailPriceHandler(index:number, price:string){
        let formattedPrice = Math.round(parseFloat(price) * 100) / 100
        dispatch(setNewItemRetailPrice({index:index, retailPrice:formattedPrice}))
        dispatch(setNewItemSpecialPrice({index:index, specialPrice: roundToNearest((formattedPrice * 100) * 0.95) / 100}))
    }
    if(!item) return null
    return(
        <RegexInput type={'money'} value={item.prices.retail} handler={(result) => retailPriceHandler(index, result)} errorMessage={"Please use format [any amount of numbers].00"}/>
    )
}

// Function from Data-Processing-Server - margin-calculation.ts - converts a number to the nearest 0.05 or 0.99
const roundToNearest = (num: number):number => {

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