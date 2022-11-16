import {MarginItem, updateMarginData} from "../../store/margin-calculator-slice";
import {useDispatch} from "react-redux";

const useUpdateItemAndCalculateMargins = ():(item:MarginItem, key?:keyof MarginItem, value?:any) => Promise<void> => {
    const dispatch = useDispatch()

    async function update(item:MarginItem, key?:keyof MarginItem, value?:any) {

        let itemClone = key && value ? {...item, ...{[key]:value}} : {...item}

        const opt = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(itemClone)
        }

        await fetch('/api/items/update-item', opt)
        let result = await fetch('/api/margin/update', opt)

        let marginUpdate = {
            ...itemClone,
            ...await result.json()
        }

        dispatch(updateMarginData(marginUpdate))
    }

    return update
}

export default useUpdateItemAndCalculateMargins