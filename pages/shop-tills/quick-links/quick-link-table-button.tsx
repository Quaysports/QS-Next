import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useDispatch} from "react-redux";
import {
    deleteQuickLinkItem,
    swapQuickLinkItems,
    updateQuickLinkItemColour
} from "../../../store/shop-tills/quicklinks-slice";
import {ChangeEvent, DragEvent, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {schema} from "../../../types";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

interface Props {
    itemIndex: number;
    item: Pick<schema.Item, | "SKU" | "title" | "prices" | "till">
}

export default function QuickLinkButton({itemIndex, item}: Props) {

    const router = useRouter()
    const linksIndex = Number(router.query.linksIndex)
    let dispatch = useDispatch()

    const [inputColour, setInputColour] = useState<string | undefined>(item?.till.color ? item.till.color : "")
    useEffect(()=>{setInputColour(item?.till.color ? item.till.color : "")},[item])

    const deleteItem = () => dispatch(deleteQuickLinkItem({linksIndex: linksIndex, itemIndex: itemIndex}))

    if(!item) return null
    const colourHandler = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateQuickLinkItemColour({
            linksIndex: linksIndex,
            itemIndex: itemIndex,
            colour: event.target.value
        }))
    }

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
                <div>{toCurrency(item.prices.shop)}</div>
                <div className={styles["title-text"]}>{item.title}</div>
                <div className={styles["dual-button-container"]}>
                    <input key={`${item.SKU}-${item.till.color}`} type={"color"} defaultValue={item.till.color}
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