import {
    selectCurrentSupplier,
    selectItem, selectSuppliers,
    setItemSupplier
} from "../../../../store/item-database/item-database-slice";
import {useDispatch, useSelector} from "react-redux";

export default function SuppliersSelect() {

    const currentSupplier = useSelector(selectCurrentSupplier)
    const dispatch = useDispatch()
    const item = useSelector(selectItem)
    const suppliers = useSelector(selectSuppliers)

    function supplierOptions() {
        let supplierArray = [<option key={"suppliers null"}/>]
        for (let i = 0; i < suppliers.length; i++) {
            supplierArray.push(
                <option key={"suppliers " + i}>{suppliers[i]}</option>
            )
        }
        return supplierArray
    }

    function supplierHandler(supplier: string) {
        dispatch(setItemSupplier(supplier))
    }

    return (
        <div>
            <select value={currentSupplier ? currentSupplier : item.supplier}
                    onChange={(e) => supplierHandler(e.target.value)}>
                {supplierOptions()}
            </select>
        </div>
    )
}