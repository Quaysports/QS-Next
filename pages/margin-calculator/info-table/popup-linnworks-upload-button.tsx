import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function LinnworksUploadButton({item}:{item:MarginItem}){
    const updateItem = useUpdateItemAndCalculateMargins()

    return <button onClick={()=>{

        const opts = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({items:[item]})
        }

        fetch("/api/linnworks/update-channel-prices", opts).then(async()=>{
            await updateItem(item)
            dispatchNotification({type:undefined})
        })

    }}>Upload to Linnworks</button>
}