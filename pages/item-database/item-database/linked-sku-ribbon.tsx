import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"

export default function LinkedSKURibbon(){

    const item = useSelector(selectItem)
    const linkedSKUs:string[]  = item.LINKEDSKUS ? item.LINKEDSKUS : []

    function linkedSKUS(){
        let linkedSKUArray = []

        if(!item?.LINKEDSKUS) return null

        for(const SKU of linkedSKUs){
            linkedSKUArray.push(
                <div>{SKU}</div>
            )
        }
        return linkedSKUArray
    }
    return (
        <div className={styles["item-details-linked-skus"]}>
            {linkedSKUS()}
        </div>
    )
}