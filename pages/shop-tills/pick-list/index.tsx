import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectPickList} from "../../../store/shop-tills/pick-list-slice";
import styles from "./pick-list.module.css"
import {useEffect, useState} from "react";

export default function PickList(){
    return <div className={styles.container}><Menu/><List/></div>
}

function Menu(){

    const [dateInput, setDateInput] = useState<string>("")
    const router = useRouter()
    const items = useSelector(selectPickList)

    useEffect(()=>{
        router.query.date
            ? setDateInput(new Date(Number(router.query.date as string)).toISOString().substring(0,10))
            : setDateInput(new Date().toISOString().substring(0,10))
    },[router.query.date])

    return <div className={styles.menu}>
        <button onClick={()=>{
            if(!window) return
            window.open("/print?app=shop-picklist", "_blank")
            window.localStorage.setItem("pick-list", JSON.stringify({date:dateInput, items:items}))}
        }>Print</button>
        <input type="date" value={dateInput} onChange={async(e)=>{
            await router.push({pathname:router.pathname,query:{...router.query, date:new Date(e.target.value).getTime()}})
        }}/>
    </div>
}

function List(){
    const items = useSelector(selectPickList)
    if(!items) return null

    let elements = []
    for(let item of items){
        let row = <div className={styles.row}>
            <div className={styles.quantity}>{item.quantity}</div>
            <div className={styles.quantity}>{item.stock.total < 100 ? item.stock.total : "99+"}</div>
            <div>{item.SKU}</div>
            <div>{item.title}</div>
        </div>
        elements.push(row)
    }

    return <div>
        {elements}
    </div>
}