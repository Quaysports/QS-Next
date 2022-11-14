import {MarginItem, selectPackaging, selectPostage} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalculateMargins from "../use-update-item-and-calc-margins";
import {useSelector} from "react-redux";
import styles from "../margin-calculator.module.css";

export default function ItemRow({item}: { item: MarginItem }) {

    const updateItem = useUpdateItemAndCalculateMargins()
    const packaging = useSelector(selectPackaging)
    const postage = useSelector(selectPostage)

    function postOptions() {
        let opts = []
        for (let option of Object.values(postage!)) {
            opts.push(<option key={option.POSTID} value={option.POSTID}>{option.SFORMAT}</option>)
        }
        return opts
    }

    function postModifierOptions() {
        let opts = []
        let mods = ['x2', 'x3', -3, -2, -1, -0.5, -0.25, -0.10, 0, 0.10, 0.25, 0.5, 1, 2, 3];
        for (let option of mods) {
            opts.push(<option key={option} value={option}>{option}</option>)
        }
        return opts
    }

    return <div key={item.SKU} className={`${styles.row} ${styles["costs-grid"]}`}>
        <div>
            £{item.PURCHASEPRICE.toFixed(2)}
        </div>
        <div>
            {item.MD?.TOTALPROFITLY ? `£${item.MD.TOTALPROFITLY?.toFixed(2)}` : ""}
        </div>
        <div>
            {item.STOCKVAL ? `£${item.STOCKVAL.toFixed(2)}` : ""}
        </div>
        <span>
            {packaging ? packaging[item.PACKGROUP].NAME : ""}
        </span>
        <div>
            {packaging ? `£${packaging[item.PACKGROUP].PRICE?.toFixed(2)}` : ""}
        </div>
        <div>
            <select
                defaultValue={item.POSTID}
                onChange={async (e) => await updateItem(item, "POSTID", e.target.value)}
            >{postOptions()}</select>
        </div>
        <div>
            <select
                defaultValue={item.POSTMODID}
                onChange={async (e) => await updateItem(item, "POSTMODID", e.target.value)}
            >{postModifierOptions()}</select>
        </div>
        <div>
            {item.MD.POSTALPRICEUK
                ? `£${item.MD.POSTALPRICEUK.toFixed(2)}`
                : `£${(0).toFixed(2)}`}
        </div>
    </div>
}