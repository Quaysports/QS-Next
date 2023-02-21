import {useDispatch, useSelector} from "react-redux";
import {dataBaseSave, selectItem, setItemBrand} from "../../../../store/item-database/item-database-slice";

export default function BrandInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function brandHandler(brand: string) {
        dispatch(setItemBrand(brand))
    }
    function saveItem() {
        dispatch(dataBaseSave())
    }

    return (
        <div>
            <input value={item.brand} onBlur={() => {
                saveItem()}}
                   onChange={(e) => brandHandler(e.target.value)}
            />
        </div>
    )
}