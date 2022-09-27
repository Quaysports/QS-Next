import styles from '../shop-tills.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {useDispatch} from "react-redux";
import {deleteQuickLinkItem} from "../../../store/shop-tills/quicklinks-slice";

export default function QuickLinkButton({listIndex, itemIndex, item}) {

    let dispatch = useDispatch()

    function deleteItem(){
        console.log(listIndex)
        console.log("delete! " + itemIndex)
        dispatch(deleteQuickLinkItem({listIndex:listIndex, itemIndex:itemIndex}))
    }

    return (
        <>
            <div className={styles["quick-link-table-button"]}>
                <div>{item.SKU}</div>
                <div>{item.SHOPPRICEINCVAT}</div>
                <div className={styles["title-text"]}>{item.TITLE}</div>
                <button onClick={()=>dispatchNotification({
                    type:"confirm",
                    title:"Remove Item",
                    content:"Are you sure you want to remove this item?",
                    fn:deleteItem
                })}>X</button>
            </div>
        </>
    )
}