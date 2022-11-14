import {MarginItem} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import StatusAndUploadPopup from "./status-and-upload-popup";

export default function ItemRow({item}:{item:MarginItem}){

    const updateItem = useUpdateItemAndCalculateMargins()

    return <div key={item.SKU} className={`${styles.row} ${styles["info-grid"]}`}>
        <div>
            <StatusAndUploadPopup item={item}/>
        </div>
        <div>
            <input type={"checkbox"}
                   defaultChecked={item.HIDE}
                   onChange={async(e)=>{
                       await updateItem(item, "HIDE", e.target.checked)
                   }}/>
        </div>
        <span>{item.SKU}</span>
    </div>
}