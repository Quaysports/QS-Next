import RegexInput from "../../../../components/regex-input";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setNewItemQuantity} from "../../../../store/item-database/new-items-slice";

type Props = {
    index:number
}
export default function QuantityInput({index}:Props){

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))
    function quantityHandler(index:number, quantity:string){
        dispatch(setNewItemQuantity({index:index, quantity: parseInt(quantity)}))
    }
    if(!item) return null
    return (
        <RegexInput type={'number'} value={item.stock.total} errorMessage={"Please use only numbers"} handler={(result) => quantityHandler(index, result)}/>
    )
}