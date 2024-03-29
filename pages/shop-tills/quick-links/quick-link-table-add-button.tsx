import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import DatabaseSearchBar, {DatabaseSearchItem} from "../../../components/database-search-bar/database-search";
import {addItemToLinks, swapQuickLinkItems} from "../../../store/shop-tills/quicklinks-slice";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {DragEvent} from "react";

interface Props {
    itemIndex: number;
}

export default function QuickLinkTableAddButton({itemIndex}: Props) {

    const router = useRouter()
    const linksIndex = Number(router.query.linksIndex)

    const dispatch = useDispatch()

    const handler = (res: DatabaseSearchItem) => {
        dispatchNotification({type: undefined})
        dispatch(addItemToLinks({
            linksIndex: linksIndex,
            itemIndex: itemIndex,
            sku: res.SKU,
        }))
    }

    const dragOverHandler = (event: DragEvent<HTMLDivElement>) =>{
        event.currentTarget.style.boxShadow = "var(--primary-box-shadow)"
        event.stopPropagation();
        event.preventDefault();
    }
    const dragLeaveHandler = (event: DragEvent<HTMLDivElement>) => event.currentTarget.style.boxShadow = ""
    const dropHandler = (event: DragEvent<HTMLDivElement>) => {
        event.currentTarget.style.boxShadow = ""
        let targetIndex = Number(event.dataTransfer.getData("draggedId"))
        dispatch(swapQuickLinkItems({linksIndex:linksIndex,itemIndex:itemIndex,targetIndex:targetIndex}))
    }

    return (
        <>
            <div
                className={styles["table-add-button"]}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDrop={dropHandler}
                onClick={() => dispatchNotification({
                    type: "popup",
                    title: "Item Search",
                    fn:handler,
                    content: <DatabaseSearchBar handler={handler}/>
                })}>
                <div>+</div>
            </div>
        </>
    )
}