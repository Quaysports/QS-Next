import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {useDispatch} from "react-redux";
import {
    deleteQuickLinkItem,
    swapQuickLinkItems,
    updateQuickLinkItemColour
} from "../../../store/shop-tills/quicklinks-slice";
import {QuickLinkItem} from "../../../server-modules/shop/shop";
import {ChangeEvent, DragEvent, useEffect, useState} from "react";
import {useRouter} from "next/router";

interface Props {
    itemIndex: number;
    item: QuickLinkItem
}

export default function QuickLinkButton({itemIndex, item}: Props) {

    const router = useRouter()
    const linksIndex = Number(router.query.linksIndex)
    let dispatch = useDispatch()

    const [inputColour, setInputColour] = useState<string | undefined>(item?.COLOUR ? item?.COLOUR : "")
    useEffect(()=>{
        setInputColour(item?.COLOUR ? item?.COLOUR : "")
        console.log(itemIndex, inputColour)
    },[item])

    const deleteItem = () => dispatch(deleteQuickLinkItem({linksIndex: linksIndex, itemIndex: itemIndex}))

    const colourHandler = (event: ChangeEvent<HTMLInputElement>) => dispatch(updateQuickLinkItemColour({
        linksIndex: linksIndex,
        itemIndex: itemIndex,
        colour: event.target.value
    }))

    const dragStartHandler = (event: DragEvent<HTMLDivElement>)=>event.dataTransfer.setData("draggedId", `${itemIndex}`)
    const dragLeaveHandler = (event: DragEvent<HTMLDivElement>) => event.currentTarget.style.boxShadow = ""
    const dragOverHandler = (event: DragEvent<HTMLDivElement>) =>{
        event.currentTarget.style.boxShadow = "var(--primary-box-shadow)"
        event.stopPropagation();
        event.preventDefault();
    }

    const dropHandler = (event: DragEvent<HTMLDivElement>) => {
        event.currentTarget.style.boxShadow = ""
        let targetIndex = Number(event.dataTransfer.getData("draggedId"))
        dispatch(swapQuickLinkItems({linksIndex:linksIndex,itemIndex:itemIndex,targetIndex:targetIndex}))
    }

    return (
        <>
            <div
                className={styles["table-button"]}
                style={{background: inputColour}}
                draggable
                onDragStart={dragStartHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDrop={dropHandler}
            >
                <div>{item?.SKU}</div>
                <div>{"£" + parseFloat(item?.SHOPPRICEINCVAT!).toFixed(2)}</div>
                <div className={styles["title-text"]}>{item?.TITLE}</div>
                <div className={styles["dual-button-container"]}>
                    <input key={`${item?.SKU}-${item?.COLOUR}`} type={"color"} defaultValue={item?.COLOUR}
                           onChange={e => setInputColour(e.target.value)} onBlur={colourHandler}/>
                    <button onClick={() => dispatchNotification({
                        type: "confirm",
                        title: "Remove Item",
                        content: "Are you sure you want to remove this item?",
                        fn: deleteItem
                    })}>X
                    </button>
                </div>
            </div>
        </>
    )
}