import {MarginItem, updateUploadedIndexes} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useDispatch} from "react-redux";

export default function LinnworksUploadButton({item, index}:{item:MarginItem, index:string}){

    const dispatch = useDispatch()
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
            dispatchNotification()
            dispatch(updateUploadedIndexes(index))
        })

    }}>Upload to Linnworks</button>
}