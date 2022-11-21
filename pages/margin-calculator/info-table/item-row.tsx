import {MarginItem, selectActiveIndex, selectDisplayTitles} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import StatusAndUploadPopup from "./status-and-upload-popup";
import {useSelector} from "react-redux";
import TitleCell from "./title-cell";
import SkuCell from "./sku-cell";
import {useEffect, useState} from "react";

export default function ItemRow({item, index}:{item:MarginItem, index:string}){

    const updateItem = useUpdateItemAndCalculateMargins()
    const displayTitles = useSelector(selectDisplayTitles)

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(()=>{setClasses(cssClasses())},[activeIndex])

    function cssClasses(){
        let classes = styles.row
        classes += displayTitles ? ` ${styles["info-grid"]}` : ` ${styles["info-grid-collapsed"]}`
        classes += activeIndex === index ? ` ${styles["active"]}` : ""
        return classes
    }

    if(!item) return null

    return <div key={item.SKU} className={classes}>
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
        <SkuCell item={item} index={index}/>
        {displayTitles ? <TitleCell item={item}/> : null}
    </div>
}