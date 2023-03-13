import {useDispatch} from "react-redux";
import {createShipment} from "../../../store/shipments-slice";


export default function ShipmentsMenu() {
    const dispatch = useDispatch()

    return <><span onClick={()=>{
        dispatch(createShipment())
    }}>Create Shipment</span></>
}