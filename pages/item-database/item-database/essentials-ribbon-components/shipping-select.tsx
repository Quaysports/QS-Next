import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemShipping} from "../../../../store/item-database/item-database-slice";


export default function ShippingSelect(){

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    const shippingHandler = (value:string) => {
        dispatch(setItemShipping(value))
    }
    const shippingOptions = () => {
        return (
            <>
                <option/>
                <option value={"RM Large Letter"}>Large Letter</option>
                <option value={"RM Packet"}>Packet</option>
                <option value={"RM Packet 24"}>Packet 24</option>
                <option value={"Courier"}>Courier</option>
            </>
        )
    }

    return <select value={item.mappedExtendedProperties.shippingFormat} onChange={(e) => shippingHandler(e.target.value)}>{shippingOptions()}</select>
}