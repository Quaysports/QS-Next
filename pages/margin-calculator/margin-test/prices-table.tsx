import styles from "./test-styles.module.css";
import {UpdateHandler} from "./index";

export default function PricesTable({item, handler}: UpdateHandler) {

    if(!item) return null

    return <>
        <div className={styles["prices-row"]}>
            <div>Discount</div>
            <div>Ebay</div>
            <div>Amazon</div>
            <div>Quaysports</div>
            <div>Shop</div>
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
                       defaultValue={item.prices.ebay}
                       onBlur={(e) => {
                           const update = {...item.prices, ebay: parseFloat(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices.amazon}
                       onBlur={(e) => {
                           const update = {...item.prices, amazon: parseFloat(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices.magento}
                       onBlur={(e) => {
                           const update = {...item.prices, magento: parseFloat(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.prices.shop}
                       onBlur={(e) => {
                           const update = {...item.prices, shop: parseFloat(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
        </div>
    </>
}