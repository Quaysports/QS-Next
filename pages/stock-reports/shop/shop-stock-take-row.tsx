import styles from './shop-stock-take.module.css'
import {useDispatch} from "react-redux";
import {BrandItem, setStockTakeInfo, StockTake} from "../../../store/stock-reports-slice";
import RegexInput from "../../../components/RegexInput";

interface props {
    item?: BrandItem | null;
    index?: string | null;
}

export default function ShopStockTakeRow({index = null, item = null}: props) {
    const dispatch = useDispatch()

    let loadedStockTake:StockTake = item?.stockTake ? item.stockTake : {checked:false, date:null, quantity:0}

    const updateSlice = (index:string, stockTake:StockTake) =>{
        dispatch(setStockTakeInfo({index: Number(index), data: stockTake}))
    }
    const validationHandler = (value:string) =>{
        loadedStockTake.quantity = Number(value)
        updateSlice(index!, loadedStockTake)
    }

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
                    <div>{!item.stockTake?.date
                        ? <RegexInput
                            type={"number"}
                            value={item.stockTake?.quantity ? item.stockTake.quantity : 0}
                            handler={validationHandler}
                            errorMessage={"Numbers Only"}/>
                        : item.stockTake?.quantity}
                    </div>
                    <div>{!item.stockTake?.date
                        ? <input
                            type={"checkbox"}
                            defaultChecked={item.stockTake?.checked}
                            onChange={e => {
                                loadedStockTake.checked = e.target.checked
                                updateSlice(index!, loadedStockTake)
                            }}/>
                        : <input
                            type={"checkbox"}
                            checked={item.stockTake?.checked}
                            readOnly={true}/>}
                    </div>
                </div>}
        </>
    )
}