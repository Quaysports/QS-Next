import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemBrand} from "../../../../store/item-database/item-database-slice";

export default function BrandInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function brandHandler(brand: string) {
        dispatch(setItemBrand(brand))
    }

    return (
        <div>
            <input value={item.IDBEP.BRAND} onChange={(e) => {
                brandHandler(e.target.value)
            }}/>
        </div>
    )
}