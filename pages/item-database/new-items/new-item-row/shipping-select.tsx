import {useDispatch, useSelector} from "react-redux";
import {selectItem, setNewItemShippingFormat} from "../../../../store/item-database/new-items-slice";

type Props = {
    index: number
}
export default function ShippingSelect({index}: Props) {

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))

    function shippingOptions() {
        return (
            <>
                <option value={""}/>
                <option value={"RM Large Letter"}>Large Letter</option>
                <option value={"RM Packet"}>Packet</option>
                <option value={"RM Packet 24"}>Packet 24</option>
                <option value={"Courier"}>Courier</option>
            </>
        )
    }

    function shippingHandler(value: string) {
        dispatch(setNewItemShippingFormat({index: index, shippingFormat: value}))
    }
    if(!item) return null
    return (
        <select value={item.mappedExtendedProperties.shippingFormat} onChange={(e) => {shippingHandler(e.target.value)}}>
            {shippingOptions()}
        </select>
    )
}
