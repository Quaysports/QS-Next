import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import {selectTransfer} from "../../../store/stock-transfer-slice";
import styles from '../stock-transfer.module.css'

export default function CompletedTransfers() {

    const router = useRouter()
    const completeTransfer = useSelector(selectTransfer(parseInt(router.query.index as string)))

    if (!completeTransfer) return null

    return (
        <div className={styles['complete-transfer-container']}>
            <div className={styles['complete-transfer-title']}>
                <span>SKU</span>
                <span>Title</span>
                <span>Old Default</span>
                <span>Old Warehouse</span>
                <span>Transfer</span>
                <span>New Default</span>
                <span>New Warehouse</span>
            </div>
            {completeTransfer.items.map((item) => {
                return (
                    <div className={styles['complete-transfer-row']}>
                        <div>{item.SKU}</div>
                        <div>{item.title}</div>
                        <span>{item.stock.default}</span>
                        <span>{item.stock.warehouse}</span>
                        <span>{item.transfer}</span>
                        <span>{item.newStockLevels.default}</span>
                        <span>{item.newStockLevels.warehouse}</span>
                    </div>
                )
            })}
        </div>
    )
}