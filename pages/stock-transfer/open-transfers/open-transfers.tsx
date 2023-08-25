import {useDispatch, useSelector} from "react-redux";
import {selectOpenTransfer, setTransfer, saveTransfer,removeSKU, updateOpenTransfer} from "../../../store/stock-transfer-slice";
import styles from '../stock-transfer.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import ColumnLayout from "../../../components/layouts/column-layout";
import { LowStockItem } from "../../../store/stock-transfer-slice";
import { useState } from "react";

export default function OpenTransfers() {

    const openTransfer = useSelector(selectOpenTransfer)
    const dispatch = useDispatch()

    // sorting sku

    // const [transferSorted, setTransferSorted] = useState<LowStockItem[]>([])
    // useEffect(() => {
    //     setTransferSorted(openTransfer.items)
    // }, [openTransfer])

    const [sortSkuOrder, setSortSkuOrder] = useState(false)
    const [sortTitleOrder, setSortTitleOrder] = useState(false)

    // function sortBySKUAsc(a:LowStockItem, b:LowStockItem) {
    //     return a.SKU.localeCompare(b.SKU);
    //   }

    // function sortBySKUDesc(a:LowStockItem, b:LowStockItem) {
    //     return b.SKU.localeCompare(a.SKU);
    // }

    // function sortByTitleAsc(a:LowStockItem, b:LowStockItem) {
    //     return a.title.localeCompare(b.title)
    // }

    // function sortByTitleDesc(a:LowStockItem, b:LowStockItem) {
    //     return b.title.localeCompare(a.title)
    // }

    // function sortByTransferAsc(a:LowStockItem, b:LowStockItem) {
    //     return a.transfer - b.transfer
    // }

    // function sortByTransferDesc(a:LowStockItem, b:LowStockItem) {
    //     return b.transfer - a.transfer
    // }

    function sortByPropertyAndDirection<T>(a: T, b: T, property: keyof T, direction: 'asc' | 'desc') {
        if (direction === 'asc') {
          return a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        } else if (direction === 'desc') {
          return a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
        }
        return 0;
      }

    const handleSortButtonClick = (property: any) => {
        setSortSkuOrder(!sortSkuOrder)
        const direction = sortSkuOrder ? 'asc' : 'desc';
        const sortedItems = openTransfer.items.slice().sort((a, b) => sortByPropertyAndDirection(a, b, property, direction))
        dispatch(updateOpenTransfer(sortedItems))
    }

    // const handleSkuSortButton = () => {
    //     setSortSkuOrder(!sortSkuOrder)
    //     const sortedItems = openTransfer.items.slice().sort(sortSkuOrder === false ? sortBySKUAsc : sortBySKUDesc)
    //     dispatch(updateOpenTransfer(sortedItems))
    // }

    // const handleTitleSortButton = () => {
    //     setSortTitleOrder(!sortTitleOrder)
    //     const sortedItems = openTransfer.items.slice().sort(sortTitleOrder === false ? sortByTitleAsc : sortByTitleDesc)
    //     dispatch(updateOpenTransfer(sortedItems))
    // }

    //

    function transferHandler(index:number, amount:string) {
        dispatch(setTransfer({index:index, amount:parseInt(amount) || 0}))
    }

    function saveHandler() {
        dispatch(saveTransfer())
    }

    function removeSkuHandler(index: number, sku:string){
        dispatchNotification({type:'confirm', title:'Remove item', content:'Are you sure you want to remove '+ sku +' from the transfer?', fn:() => dispatch(removeSKU(index))})
    }

    if (!openTransfer) return null

    return (
        <section>
            <ColumnLayout scroll={true}>
                <div className={styles["open-transfer-buttons-container"]}>
                    <div><button onClick={() => handleSortButtonClick("SKU")}>Sort by SKU</button></div>
                    <div><button onClick={() => handleSortButtonClick("title")}>Sort by Title</button></div>
                    <div><button onClick={() => handleSortButtonClick("SKU")}>Sort by Transfer</button></div>
                </div>
                <div className={styles["open-transfer-container"]}>
                <div className={styles["open-transfer-title"]}>
                    <div></div>
                    <div>SKU</div>
                    <div>Title</div>
                    <div>Roundswell</div>
                    <div>Minimum</div>
                    <div>Warehouse</div>
                    <div>Transfer</div>
                </div>
                {openTransfer.items.map((item, index) => {
                    return (
                        <div key={index} className={styles["open-transfer-row"]}>
                            <button className={styles['delete-button']} onClick={() => {removeSkuHandler(index, item.SKU)}}>X</button>
                            <div>{item.SKU}</div>
                            <div>{item.title}</div>
                            <span>{item.stock.default}</span>
                            <span>{item.stock.minimum}</span>
                            <span>{item.stock.warehouse}</span>
                            <input value={item.transfer}
                                onBlur={() => {saveHandler()}}
                                onChange={(e) => transferHandler(index, e.target.value)}
                            />
                        </div>
                    )
                })}
                </div>
            </ColumnLayout>
        </section>
    )
}