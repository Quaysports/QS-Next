import styles from '../shop-tills.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {useDispatch} from "react-redux";
import {deleteQuickLinkItem} from "../../../store/shop-tills/quicklinks-slice";
import {QuickLinkItem} from "../../../server-modules/shop/shop";

interface Props {
    listIndex:number;
    itemIndex:number;
    item:QuickLinkItem
}

export default function QuickLinkButton({listIndex, itemIndex, item}:Props) {

    let dispatch = useDispatch()

    const deleteItem = () => dispatch(deleteQuickLinkItem({listIndex:listIndex, itemIndex:itemIndex}))

    return (
        <>
            <div className={styles["quick-link-table-button"]}>
                <div>{item?.SKU}</div>
                <div>{"£"+parseFloat(item?.SHOPPRICEINCVAT!).toFixed(2)}</div>
                <div className={styles["title-text"]}>{item?.TITLE}</div>
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