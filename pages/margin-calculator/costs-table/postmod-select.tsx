import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";

export default function PostModSelect({item}: { item: MarginItem }) {

    const updateItem = useUpdateItemAndCalculateMargins()

    function postModifierOptions() {
        let opts = [<option key={"blank"} value={""}></option>]
        let mods = ['x2', 'x3', -3, -2, -1, -0.5, -0.25, -0.10, 0, 0.10, 0.25, 0.5, 1, 2, 3];
        for (let option of mods) {
            opts.push(<option key={option} value={option}>{option}</option>)
        }
        return opts
    }

    if(!item) return null

    return <select
        defaultValue={item.postage.modifier}
        onChange={async (e) => {
            const update = {...item.postage, modifier: Number(e.target.value)}
            await updateItem(item, "postage", update)
        }}
    >{postModifierOptions()}</select>
}