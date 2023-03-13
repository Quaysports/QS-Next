
import {useDispatch, useSelector} from "react-redux";
import {addItemToShipmentData, deleteItemKey, selectItemKeys} from "../../../store/shipments-slice";
import styles from '../shipment.module.css'
import {ShipmentItem} from "../../../server-modules/shipping/shipping";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
export default function ImportItemPopup() {

    const items = useSelector(selectItemKeys)
    const dispatch = useDispatch()

    if(!items) return null

    const handler = (item:Pick<ShipmentItem, "code" | "sku" | "desc">)=> {
        dispatchNotification()
        dispatch(addItemToShipmentData( {
            ...item,
            billDesc: "",
            dollarTotal: 0,
            dutyPer: "",
            dutyValue: 0,
            fobDollar: "",
            fobPound: 0,
            height: "",
            hscode: "",
            length: "",
            m3perBox: 0,
            m3total: 0,
            numOfBoxes: 0,
            orderid: "",
            perOfOrder: 0,
            poundTotal: 0,
            qty: "",
            qtyPerBox: "",
            supplier: "",
            totalPerItem: 0,
            width: ""

        }))
    }

    const deleteHandler = (item:Pick<ShipmentItem, "code" | "sku" | "desc">)=>{
        dispatch(deleteItemKey(item))
        dispatchNotification({
            type:"popup",
            title:"Import Item",
            content:<ImportItemPopup/>
        })
    }

    let elements = []
    for(const [k,item] of Object.entries(items)){
        elements.push(
            <div key={k} className={styles["import-popup-row"]}>
                <div><button onClick={()=>dispatchNotification({
                    type:"confirm",
                    title:"Delete Item",
                    content:`Are you sure you want to delete ${item.sku} - ${item.code}?`,
                    fn:()=>deleteHandler(item)
                })}>X</button></div>
                <div><button onClick={()=>handler(item)}>Import</button></div>
                <div>{item.sku}</div>
                <div>{item.code}</div>
                <div>{item.desc}</div>
            </div>
        )
    }

    return <div className={styles["import-popup-wrapper"]}>
        <div className={styles["import-popup-row"]}>
            <div></div>
            <div></div>
            <div>SKU</div>
            <div>Code</div>
            <div>Description</div>
        </div>
        {elements}
    </div>
}