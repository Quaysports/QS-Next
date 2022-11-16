import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import styles from "../margin-calculator.module.css";

export default function ItemRow({item}: { item: MarginItem }) {

    const updateItem = useUpdateItemAndCalculateMargins()

    if(!item) return null

    return <div key={item.SKU} className={`${styles.row} ${styles["misc-grid"]}`}>
        <span>
            <input
                type={"text"}
                defaultValue={item.MARGINNOTE}
                onBlur={async(e)=> await updateItem(item,"MARGINNOTE",e.target.value)}
            /></span>
    </div>
}