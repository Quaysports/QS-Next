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
                "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
            },
            body: JSON.stringify(itemClone)
        }

        await fetch('/api/items/update-item', opt)
        let marginUpdate = {
            ...itemClone,
            ...await fetch('http://192.168.1.120:3001/Margin/Update', opt).then((res)=>{
                return res.json()
            })
        }

        console.log(marginUpdate)

        dispatch(updateMarginData(marginUpdate))
    }

    return update
}

export default useUpdateItemAndCalculateMargins