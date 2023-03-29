import CSVButton from "../../components/csv-button";
import {useState} from "react";

export default function Richard() {
/*
    const [brands, setBrands] = useState<{[key:number]:string}[]>([])
    async function handler(){
        const res = await fetch("/api/dev/get-all-brands")
        const array = await res.json()
        console.log(array)
        const tempArray:{[key:number]:string}[] = []
        for(let i = 0; i < array.length; i++){
            let object:{[key:number]:string} = {}
            object[i] = array[i]
            tempArray.push(object)
        }
        setBrands(tempArray)
    }
    return (
        <div>
            <h1>Hi Richard!</h1>
            <button onClick={()=>fetch("/api/dev/correct-shop-orders")}>Correct Shop Orders</button>
            <button onClick={() => handler()}>All Brands</button>
            <CSVButton objectArray={brands}/>
        </div>
    )

 */
    return <h1>Hi Richard!</h1>
}