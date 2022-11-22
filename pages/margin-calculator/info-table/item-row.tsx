import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import StatusAndUploadPopup from "./status-and-upload-popup";
import {useSelector} from "react-redux";
import TitleCell from "./title-cell";
import SkuCell from "./sku-cell";
import {useEffect, useState} from "react";
import {selectMarginSettings} from "../../../store/session-slice";

export default function ItemRow({item, index}:{item:MarginItem, index:string}){

    const updateItem = useUpdateItemAndCalculateMargins()
    const settings = useSelector(selectMarginSettings)

    const activeIndex = useSelector(selectActiveIndex)
    const [classes, setClasses] = useState(cssClasses())
    useEffect(()=>{setClasses(cssClasses())},[activeIndex, settings?.displayTitles])

    function cssClasses(){
        let classes = styles.row
        classes += settings?.displayTitles ? ` ${styles["info-grid"]}` : ` ${styles["info-grid-collapsed"]}`
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
        {settings?.displayTitles ? <TitleCell item={item}/> : null}
    </div>
}