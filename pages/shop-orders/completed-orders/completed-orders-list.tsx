import {selectCompletedOrders, setOrderContents} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

export default function CompletedOrdersList() {

    const dispatch = useDispatch()
    const completedOrders = useSelector(selectCompletedOrders)
    const router = useRouter()

    if (!router.query.index) return null

    let tempArray = [<option key={0}>Select Order</option>]

    Object.values(completedOrders![Number(router.query.index)]).forEach((value) => {
        for (let i = 0; i < value.length; i++) {
            tempArray.push(
                <option key={value[i].id! + i}>{value[i].id}</option>
            )
        }
    })

    return (
        <div className={styles["shop-orders-table-containers"]}>
            Completed Order: <select onChange={(e) => dispatch(setOrderContents({index: router.query.index! as string, id:e.target.value}))}>{tempArray}</select>
        </div>
    )
}