import styles from './shop-stock-take.module.css'
import {useDispatch} from "react-redux";
import {BrandItem, setStockTakeInfo, unFlagCommit} from "../../../store/reports/stock-reports-slice";
import RegexInput from "../../../components/regex-input";
import StockTake = schema.StockTake;
import {schema} from "../../../types";

interface props {
    item?: BrandItem | null;
    index?: string | null;
}

export default function ShopStockTakeRow({index = null, item = null}: props) {
    const dispatch = useDispatch()

    let loadedStockTake:StockTake = item?.stockTake ? {...item.stockTake} : {checked:false, date:null, quantity:0}

    const updateSlice = (index:string, stockTake:StockTake) =>{
        if(!item) return null
        dispatch(setStockTakeInfo({sku:item?.SKU, data: stockTake}))
    }

    const validationHandler = (value:string) =>{
        loadedStockTake.quantity = Number(value)
        updateSlice(index!, loadedStockTake)
    }

    return (
        <table className={styles.table} data-testid={item?.SKU}>
          {!item ? (
            <thead>
              <tr>
                <th>SKU</th>
                <th>EAN</th>
                <th>Title</th>
                <th>Stock</th>
                <th>Update</th>
                <th>Checked</th>
                <th>Date Checked</th>
                <th>Undo</th>
              </tr>
            </thead>
          ) : (
            <tbody>
              <tr className={styles.row}>
                <td>{item.SKU}</td>
                <td>{item.EAN}</td>
                <td>{item.title}</td>
                <td>{item.stock.total}</td>
                <td>
                  {!item.stockTake?.date ? (
                    <RegexInput
                      type={'number'}
                      value={item.stockTake?.quantity ? item.stockTake.quantity : 0}
                      handler={validationHandler}
                      errorMessage={'Numbers Only'}
                    />
                  ) : (
                    item.stockTake?.quantity
                  )}
                </td>
                <td>
                  {!item.stockTake?.date ? (
                    <input
                      type={'checkbox'}
                      checked={item.stockTake?.checked ? item.stockTake?.checked : false}
                      onChange={(e) => {
                        loadedStockTake.checked = e.target.checked;
                        updateSlice(index!, loadedStockTake);
                      }}
                    />
                  ) : (
                    <input
                      type={'checkbox'}
                      checked={item.stockTake?.checked ? item.stockTake?.checked : false}
                      readOnly={true}
                    />
                  )}
                </td>
                <td>{item.stockTake?.date ? item.stockTake?.date?.slice(4, 16) : 'N/A'}</td>
                <td>
                  <button onClick={() => dispatch(unFlagCommit(item.SKU))}>&#9100;</button>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      );
}