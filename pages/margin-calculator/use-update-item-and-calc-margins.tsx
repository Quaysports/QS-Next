import {MarginItem, updateMarginData} from "../../store/margin-calculator-slice";
import {useDispatch} from "react-redux";

const useUpdateItemAndCalculateMargins = ():(item:MarginItem, key:keyof MarginItem, value:any) => Promise<void> => {
    const dispatch = useDispatch()

    async function update(item:MarginItem, key:keyof MarginItem, value:any) {

        let itemClone = {...item, ...{[key]:value}}

        const opt = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": "9b9983e5-30ae-4581-bdc1-3050f8ae91cc"
            },
            body: JSON.stringify(itemClone)
        }

        let update = await fetch('/api/items/update-item', opt)
        console.log("Item Update", update)
        let marginUpdate = await fetch('http://192.168.1.120:3001/Margin/Update', opt).then((res)=>{return res.json()})
        console.log("Margin Calculation", marginUpdate)
        dispatch(updateMarginData(marginUpdate))
    }

    return update
}

export default useUpdateItemAndCalculateMargins