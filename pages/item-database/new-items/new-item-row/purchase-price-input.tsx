import RegexInput from "../../../../components/regex-input";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setNewItemPurchasePrice} from "../../../../store/item-database/new-items-slice";

type Props = {
    index:number
}
export default function PurchasePriceInput({index}: Props){

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))
    function purchasePriceHandler(price:string) {
        let formattedPrice = Math.round(parseFloat(price) * 100) / 100
        dispatch(setNewItemPurchasePrice({index:index, purchasePrice:formattedPrice}))
    }
    if(!item) return null
    return (
        <RegexInput type={'money'} value={item.prices.purchase} errorMessage={"Please use format [any amount of numbers].00"} handler={(result) => (purchasePriceHandler(result))}/>
    )
}