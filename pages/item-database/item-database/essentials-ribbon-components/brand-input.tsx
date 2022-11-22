import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItem, setItemBrand} from "../../../../store/item-database/item-database-slice";

export default function brandInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function brandHandler(brand:string) {
        dispatch(setItemBrand(brand))
    }

    return <input value={item?.IDBEP?.BRAND} onChange={(e) => {brandHandler(e.target.value)}}/>
}