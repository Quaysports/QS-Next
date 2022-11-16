import {MarginItem, selectPostage} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import {useSelector} from "react-redux";

export default function PostSelect({item}:{item:MarginItem}){

    if(!item) return null

    const updateItem = useUpdateItemAndCalculateMargins()
    const postage = useSelector(selectPostage)

    function postOptions() {
        let opts = []
        for (let option of Object.values(postage!)) {
            opts.push(<option key={option.POSTID} value={option.POSTID}>{option.SFORMAT}</option>)
        }
        return opts
    }

    return <select
        defaultValue={item.POSTID}
        onChange={async (e) => await updateItem(item, "POSTID", e.target.value)}
    >{postOptions()}</select>
}