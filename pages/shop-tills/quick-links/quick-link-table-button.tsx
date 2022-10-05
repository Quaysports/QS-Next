import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {useDispatch} from "react-redux";
import {deleteQuickLinkItem, updateQuickLinkItemColour} from "../../../store/shop-tills/quicklinks-slice";
import {QuickLinkItem} from "../../../server-modules/shop/shop";
import {ChangeEvent, useState} from "react";
import {useRouter} from "next/router";

interface Props {
    itemIndex:number;
    item:QuickLinkItem
}

export default function QuickLinkButton({itemIndex, item}:Props) {

    const router = useRouter()
    const linksIndex = Number(router.query.linksIndex)
    let dispatch = useDispatch()

    const [inputColour, setInputColour] = useState(item?.COLOUR ? item?.COLOUR : "")

    const deleteItem = () => dispatch(deleteQuickLinkItem({linksIndex:linksIndex, itemIndex:itemIndex}))
    const colourHandler = (event:ChangeEvent<HTMLInputElement>)=> dispatch(updateQuickLinkItemColour({
        linksIndex:linksIndex,
        itemIndex:itemIndex,
        colour: event.target.value
    }))

    return (
        <>
            <div className={styles["table-button"]} style={{background: inputColour}}>
                <div>{item?.SKU}</div>
                <div>{"£"+parseFloat(item?.SHOPPRICEINCVAT!).toFixed(2)}</div>
                <div className={styles["title-text"]}>{item?.TITLE}</div>
                <div className={styles["dual-button-container"]}>
                    <input key={`${item?.SKU}-${item?.COLOUR}`} type={"color"} defaultValue={inputColour} onChange={e=>setInputColour(e.target.value)} onBlur={colourHandler}/>
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