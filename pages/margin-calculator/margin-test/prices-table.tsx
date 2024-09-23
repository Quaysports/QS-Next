import styles from "./test-styles.module.css";
import {UpdateHandler} from "./index";
import {currencyToLong} from "../../../components/utils/utils";

export default function PricesTable({item, handler}: UpdateHandler) {

    if(!item) return null

    return <>
        <div className={styles["prices-row"]}>
            <div>Discount</div>
            <div>Ebay</div>
            <div>Amazon</div>
            <div>Quaysports</div>
            <div>Onbuy</div>
        </div>
        <div className={styles["prices-row"]}>
            <div className={styles["input-pound"]}>
                %
                <input type={"number"}
                       step={1}
                       min={0}
                       defaultValue={item.discount}
                       onBlur={(e) => handler("discount", parseFloat(e.target.value))}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices.ebay / 100}
                       onBlur={(e) => {
                           const update = {...item.prices, ebay: currencyToLong(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices.amazon / 100}
                       onBlur={(e) => {
                           const update = {...item.prices, amazon: currencyToLong(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices.magento / 100}
                       onBlur={(e) => {
                           const update = {...item.prices, magento: currencyToLong(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices["onbuy v2"] / 100}
                       onBlur={(e) => {
                           const update = {...item.prices, "onbuy v2": currencyToLong(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
        </div>
    </>
}