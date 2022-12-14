import styles from "../shop-orders.module.css";
import {useSelector} from "react-redux";
import {selectOrderContents} from "../../../store/shop-orders-slice";

export default function ShowOrder() {

    const orderContents = useSelector(selectOrderContents)

    if (orderContents) {
        let tempArray:JSX.Element[] = []
        orderContents.arrived.forEach((item, index) => {
                tempArray.push(
                    <div key={index}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["completed-orders-list-grid"]}`}>
                        <span className={"center-align"}>{item.qty}</span>
                        <span>{item.SKU}</span>
                        <span>{item.TITLE}</span>
                    </div>
                )
            }
        )
        return (
            <div className={styles["shop-orders-table-containers"]}>
                <div className={`${styles["shop-orders-table"]} ${styles["completed-orders-list-grid"]}`}>
                    <span className={"center-align"}>Amount</span>
                    <span>SKU</span>
                    <span>Title</span>
                </div>
                {tempArray}
            </div>
        )
    } else {
        return null
    }
}