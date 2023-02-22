import {MarginItem, selectPostage} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import {useSelector} from "react-redux";

export default function PostSelect({item}:{item:MarginItem}){

    const updateItem = useUpdateItemAndCalculateMargins()
    const postage = useSelector(selectPostage)

    if(!item) return null

    function postOptions() {
        let opts = [<option key={"blank"} value={""}></option>]
        for (let option of Object.values(postage!)) {
            opts.push(<option key={option.id} value={option.id}>{option.tag}</option>)
        }
        return opts
    }

    return <select
        defaultValue={item.postage.id}
        onChange={async (e) => {
            const update = {...item.postage, id: e.target.value}
            await updateItem(item, "postage", update)
        }}
    >{postOptions()}</select>
}