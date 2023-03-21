import {useDispatch, useSelector} from "react-redux";
import {selectOpenTransfer, setTransfer, saveTransfer,removeSKU} from "../../../store/stock-transfer-slice";
import styles from '../stock-transfer.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function OpenTransfers() {

    const openTransfer = useSelector(selectOpenTransfer)
    const dispatch = useDispatch()

    function transferHandler(index:number, amount:string) {
        dispatch(setTransfer({index:index, amount:parseInt(amount) || 0}))
    }

    function saveHandler() {
        dispatch(saveTransfer())
    }

    function removeSkuHandler(index: number, sku:string){
        dispatchNotification({type:'confirm', title:'Remove item', content:'Are you sure you want to remove '+ sku +' from the transfer?', fn:() => dispatch(removeSKU(index))})
    }

    if (!openTransfer) return null

    return (
        <div className={styles["open-transfer-container"]}>
            <div className={styles["open-transfer-title"]}>
                <div></div>
                <div>SKU</div>
                <div>Title</div>
                <div>Roundswell</div>
                <div>Minimum</div>
                <div>Warehouse</div>
                <div>Transfer</div>
            </div>
            {openTransfer.items.map((item, index) => {
                return (
                    <div key={index} className={styles["open-transfer-row"]}>
                        <button className={styles['delete-button']} onClick={() => {removeSkuHandler(index, item.SKU)}}>X</button>
                        <div>{item.SKU}</div>
                        <div>{item.title}</div>
                        <span>{item.stock.default}</span>
                        <span>{item.stock.minimum}</span>
                        <span>{item.stock.warehouse}</span>
                        <input value={item.transfer}
                               onBlur={() => {saveHandler()}}
                               onChange={(e) => transferHandler(index, e.target.value)}
                        />
                    </div>
                )
            })}
        </div>
    )
}