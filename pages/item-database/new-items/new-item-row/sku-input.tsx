import {useDispatch, useSelector} from "react-redux";
import {selectItem, setNewItemSKU} from "../../../../store/item-database/new-items-slice";
import RegexInput from "../../../../components/regex-input";

type Props = {
    index:number
}
export default function SKUInput({index}:Props){

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))
    function skuHandler(index:number, value:string){
        dispatch(setNewItemSKU({index:index, SKU: value}))
    }
    if(!item) return null
    return (
        <RegexInput type={"alphanumeric"} value={item.SKU} handler={(result) => {skuHandler(index, result)}} errorMessage={"Only include letters, numbers and '-' in SKU"}/>
    )
}