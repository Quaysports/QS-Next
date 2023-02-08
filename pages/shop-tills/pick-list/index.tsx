import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectPickList} from "../../../store/shop-tills/pick-list-slice";
import styles from "./pick-list.module.css"

export default function PickList(){
    return <div className={styles.container}><Menu/><List/></div>
}

function Menu(){
    const router = useRouter()
    const items = useSelector(selectPickList)

    return <div className={styles.menu}>
        <button onClick={()=>{
            if(!window) return
            window.open("/print?app=shop-picklist", "_blank")
            window.localStorage.setItem("pick-list", JSON.stringify(items))}
        }>Print</button>
        <input type="date" onChange={async(e)=>{
            await router.push({pathname:router.pathname,query:{...router.query, date:new Date(e.target.value).getTime()}})
        }}/>
    </div>
}

function List(){
    const items = useSelector(selectPickList)
    if(!items) return null
    console.log(items)

    let elements = []
    for(let item of items){
        elements.push(<div className={styles.row}>
            <div className={styles.quantity}>{item.quantity}</div>
            <div>{item.SKU}</div>
            <div>{item.title}</div>
        </div>)
    }

    return <div>{elements}</div>
}