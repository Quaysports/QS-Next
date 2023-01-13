import {MarginItem, selectActiveIndex} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import StatusAndUploadPopup from "./status-and-upload-popup";
import {useSelector} from "react-redux";
import TitleCell from "./title-cell";
import SkuCell from "./sku-cell";
import {useEffect, useState} from "react";
import {selectMarginSettings} from "../../../store/session-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import MarginItemTest from "../margin-test";

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
            <button onClick={()=>dispatchNotification({
                type:"popup",
                title:"Margin Item Test",
                content:<MarginItemTest initialItem={item}/>}
            )}>&#129045;</button>
        </div>
        <div>
            <input type={"checkbox"}
                   defaultChecked={item.checkboxStatus.marginCalculator.hide}
                   onChange={async(e)=>{
                       const update = {
                           ...item.checkboxStatus,
                           marginCalculator:{...item.checkboxStatus.marginCalculator, hide:e.target.checked}}
                       await updateItem(item, "checkboxStatus", update)
                   }}/>
        </div>
        <SkuCell item={item} index={index}/>
        {settings?.displayTitles ? <TitleCell item={item}/> : null}
    </div>
}