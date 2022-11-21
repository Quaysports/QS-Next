import {MarginItem, selectDisplayTitles} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import StatusAndUploadPopup from "./status-and-upload-popup";
import {useSelector} from "react-redux";
import TitleCell from "./title-cell";
import SkuCell from "./sku-cell";

export default function ItemRow({item}:{item:MarginItem}){

    const updateItem = useUpdateItemAndCalculateMargins()
    const displayTitles = useSelector(selectDisplayTitles)

    if(!item) return null

    return <div key={item.SKU} className={`${styles.row} ${displayTitles ? styles["info-grid"] : styles["info-grid-collapsed"]}`}>
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
        <SkuCell item={item}/>
        {displayTitles ? <TitleCell item={item}/> : null}
    </div>
}