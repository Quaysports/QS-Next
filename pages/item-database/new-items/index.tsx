import {useDispatch, useSelector} from "react-redux";
import {
    deleteNewItem, getNewItems,
} from "../../../store/item-database/new-items-slice";
import {useRouter} from "next/router";
import NewItemRow from "./new-item-row/new-item-row";
import styles from "../item-database.module.css"
import ColumnLayout from "../../../components/layouts/column-layout";
import {schema} from "../../../types";

export default function NewItems() {

    const dispatch = useDispatch()
    const router = useRouter()
    const items = useSelector(getNewItems)

    function deleteRow(index: number) {
        dispatch(deleteNewItem(index))
    }

    function itemRowsBuilder(items:schema.Item[]) {
        const tempArray = []
        for (let i = 0; i < items.length; i++) {
            tempArray.push(<NewItemRow key={i} index={i} deleteRow={() => deleteRow(i)}/>)
        }
        return tempArray
    }

    if(!items) return null
    return (
        <ColumnLayout>
            {router.query.supplier ?
                <div>
                    <div className={`${styles['new-item-row']} center-align`}>
                        <div>Brand</div>
                        <div>SKU</div>
                        <div>Title</div>
                        <div>Purchase</div>
                        <div>Retail</div>
                        <div>Barcode</div>
                        <div>Qty</div>
                        <div>Shipping</div>
                        <div>Tags</div>
                        <div/>
                        <div>Delete</div>
                    </div>
                    {itemRowsBuilder(items)}
                </div> : null
            }
        </ColumnLayout>
    )
}