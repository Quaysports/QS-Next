import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

export default function LinnworksUploadButton({item}:{item:MarginItem}){
    const updateItem = useUpdateItemAndCalculateMargins()

    return <button onClick={()=>{

        const opts = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
            },
            body: JSON.stringify({items:[item]})
        }

        fetch("http://192.168.1.120:3001/Linn/UpdateLinnChannelPrices", opts).then(async()=>{
            await updateItem(item)
            dispatchNotification({type:undefined})
        })

    }}>Upload to Linnworks</button>
}