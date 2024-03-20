import RegexInput from "../../../../components/regex-input";
import { roundToNearest } from "../../../../components/utils/utils";
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