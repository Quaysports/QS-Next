import {useDispatch, useSelector} from "react-redux";
import {addItemFromWarehouseList, selectWarehouseItems} from "../../../store/stock-transfer-slice";
import styles from '../stock-transfer.module.css'

export default function WarehouseListPopup() {

    const warehouseItems = useSelector(selectWarehouseItems)
    const dispatch = useDispatch()

    function addItemHandler(sku:string){
        dispatch(addItemFromWarehouseList(sku))
    }

    if (!warehouseItems) return null
    return (
        <div className={styles['warehouse-popup-container']}>
            <div className={styles['warehouse-popup-title']}>
                <div>SKU</div>
                <div>Title</div>
            </div>
            {warehouseItems.map((item, index) => {
                return (
                    <div className={styles['warehouse-popup-row']} key={index} onClick={() => addItemHandler(item.SKU)}>
                        <div>{item.SKU}</div>
                        <div>{item.title}</div>
                    </div>
                )
            })}
        </div>
    )
}