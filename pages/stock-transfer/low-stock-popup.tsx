import {LowStockItem, newOpenTransfer} from "../../store/stock-transfer-slice";
import styles from './stock-transfer.module.css'
import {useDispatch} from "react-redux";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

type Props = {
    items: LowStockItem[]
}

export default function LowStockPopup({items}: Props) {

    const dispatch = useDispatch()

    function lowStockList(items: LowStockItem[]) {
        const tempArray: JSX.Element[] = [
            <div key={"title"} className={`${styles["low-stock-popup"]} ${styles["title-row"]} center-align`}>
                <span>SKU</span>
                <span>Roundswell</span>
                <span>Minimum</span>
                <span>Warehouse</span>
            </div>
        ]
        for (const item of items) {
            tempArray.push(
                <div key={item.SKU} className={styles['low-stock-popup']}>
                    <span>{item.SKU}</span>
                    <span className={"center-align"}>{item.stock.default}</span>
                    <span className={"center-align"}>{item.stock.minimum}</span>
                    <span className={"center-align"}>{item.stock.warehouse}</span>
                </div>)
        }
        return tempArray
    }

    async function createTransferHandler(items: LowStockItem[]) {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        }
        const res = await fetch('/api/stock-transfer/save-new-open-transfer', opts)
        if (res.status === 200) {
            dispatch(newOpenTransfer(items))
            dispatchNotification()
        }
    }

    if(!items) return <div></div>
    return (
        <>
            {lowStockList(items)}
            <button onClick={() => createTransferHandler(items)}>Create Transfer</button>
        </>
    )
}