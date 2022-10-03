import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"

export default function LinkedSKURibbon(){

    const item = useSelector(selectItem)

    function linkedSKUS(){
        let linkedSKUArray = []

        if(!item?.LINKEDSKUS) return null

        for(const SKU of item.LINKEDSKUS){
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