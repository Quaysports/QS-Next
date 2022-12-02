import styles from "./test-styles.module.css";
import {UpdateHandler} from "./margin-item-test-popup";

export default function PricesTable({item, handler}: UpdateHandler) {
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
                       defaultValue={item.DISCOUNT}
                       onBlur={(e) => handler("DISCOUNT", parseFloat(e.target.value))}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.EBAYPRICEINCVAT}
                       onBlur={(e) => handler("EBAYPRICEINCVAT", parseFloat(e.target.value))}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.AMZPRICEINCVAT}
                       onBlur={(e) => handler("AMZPRICEINCVAT", parseFloat(e.target.value))}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.QSPRICEINCVAT}
                       onBlur={(e) => handler("QSPRICEINCVAT", parseFloat(e.target.value))}/>
            </div>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.SHOPPRICEINCVAT}
                       onBlur={(e) => handler("SHOPPRICEINCVAT", parseFloat(e.target.value))}/>
            </div>
        </div>
    </>
}