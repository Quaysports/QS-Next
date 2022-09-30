import styles from './shop-stock-take.module.css'
import {useDispatch} from "react-redux";
import {BrandItem, setStockTakeInfo} from "../../../store/stock-reports-slice";
import RegexInput from "../../../components/RegexInput";

interface props {
    item?: BrandItem | null;
    index?: string | null;
}

export default function ShopStockTakeRow({index = null, item = null}: props) {
    const dispatch = useDispatch()

    const updateSlice = (index, id, value) => dispatch(setStockTakeInfo({index: index, id: id, data: value}))

    const validationHandler = (value) => updateSlice(index, "quantity", Number(value))

    return (
        <>
            {!item ?
                <div className={styles.title}>
                    <div>SKU</div>
                    <div>EAN</div>
                    <div>Title</div>
                    <div>Stock</div>
                    <div className={styles.center}>Update</div>
                    <div className={styles.center}>Checked</div>
                </div>
                : <div className={styles.row}>
                    <div>{item.SKU}</div>
                    <div>{item.EAN}</div>
                    <div>{item.TITLE}</div>
                    <div>{item.STOCKTOTAL}</div>
                    <div>{item.stockTake.date === null
                        ? <RegexInput
                            type={"number"}
                            value={item.stockTake?.quantity ? item.stockTake.quantity : 0}
                            handler={validationHandler}
                            errorMessage={"Numbers Only"}/>
                        : item.stockTake.quantity}
                    </div>
                    <div>{item.stockTake.date === null
                        ? <input
                            type={"checkbox"}
                            defaultChecked={item.stockTake?.checked}
                            onChange={e => updateSlice(index, "checked", e.target.checked)}/>
                        : <input
                            type={"checkbox"}
                            checked={item.stockTake.checked}
                            readOnly={true}/>}
                    </div>
                </div>}
        </>
    )
}