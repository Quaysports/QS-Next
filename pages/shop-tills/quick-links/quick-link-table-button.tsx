import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {useDispatch} from "react-redux";
import {deleteQuickLinkItem, updateQuickLinkItemColour} from "../../../store/shop-tills/quicklinks-slice";
import {QuickLinkItem} from "../../../server-modules/shop/shop";
import {ChangeEvent} from "react";

interface Props {
    listIndex:number;
    itemIndex:number;
    item:QuickLinkItem
}

export default function QuickLinkButton({listIndex, itemIndex, item}:Props) {

    let dispatch = useDispatch()

    const deleteItem = () => dispatch(deleteQuickLinkItem({listIndex:listIndex, itemIndex:itemIndex}))
    const colourHandler = (event:ChangeEvent<HTMLInputElement>)=> dispatch(updateQuickLinkItemColour({
        listIndex:listIndex,
        itemIndex:itemIndex,
        colour: event.target.value
    }))

    return (
        <>
            <div className={styles["table-button"]} style={{background: item?.COLOUR ? item.COLOUR : ""}}>
                <div>{item?.SKU}</div>
                <div>{"£"+parseFloat(item?.SHOPPRICEINCVAT!).toFixed(2)}</div>
                <div className={styles["title-text"]}>{item?.TITLE}</div>
                <div className={styles["dual-button-container"]}>
                    <input type={"color"} defaultValue={item?.COLOUR} onBlur={colourHandler}/>
                    <button onClick={()=>dispatchNotification({
                    type:"confirm",
                    title:"Remove Item",
                    content:"Are you sure you want to remove this item?",
                    fn:deleteItem
                })}>X</button>
                </div>
            </div>
        </>
    )
}