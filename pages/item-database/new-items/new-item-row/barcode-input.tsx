import RegexInput from "../../../../components/regex-input";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setNewItemBarcode} from "../../../../store/item-database/new-items-slice";

type Props = {
    index: number
}
export default function BarcodeInput({index}:Props){

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))
    function barcodeHandler(barcode:string){
        dispatch(setNewItemBarcode({index:index , barcode:barcode}))
    }
    if(!item) return null
    return (
        <RegexInput type={'barcode'} value={item.EAN} errorMessage={'Please enter between 12-13 characters and numbers only'} handler={(result) => barcodeHandler(result)}/>
    )
}