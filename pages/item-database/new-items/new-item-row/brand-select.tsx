import {useDispatch, useSelector} from "react-redux";
import {selectBrands, selectItem, setNewItemBrand} from "../../../../store/item-database/new-items-slice";

type Props = {
    index:number
}
export default function BrandSelect({index}: Props){

    const brands = useSelector(selectBrands)
    const item = useSelector(selectItem(index))
    const dispatch = useDispatch()
    function brandOptions(brands:string[]): JSX.Element[] {
        const optionsArray:JSX.Element[] = [<option key={0} value={""}></option>]
             brands.forEach((brand) => {
                 optionsArray.push(<option key={brand} value={brand}>{brand}</option>)
            })
        return optionsArray
    }

    function brandHandler(index:number, brand:string){
        dispatch(setNewItemBrand({index:index, brand:brand}))
    }

    if(!item) return null
    return (
        <select value={item.brand} onChange={(e) => brandHandler(index, e.target.value)}>
            {brandOptions(brands)}
        </select>
    )
}