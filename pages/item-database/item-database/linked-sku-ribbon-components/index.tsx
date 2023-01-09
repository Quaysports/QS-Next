import {useSelector} from "react-redux";
import {selectItem} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css"

/**
 * Linked SKU Ribbon Component
 */
export default function LinkedSKURibbon(){

    const item = useSelector(selectItem)

    function linkedSKUS(){
        let linkedSKUArray = []

        if(item.linkedSKUS.length === 0) return null

        for(const SKU of item.linkedSKUS){
            linkedSKUArray.push(
                <div key={SKU}>{SKU}</div>
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