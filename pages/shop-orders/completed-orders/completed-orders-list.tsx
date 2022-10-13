import {selectCompletedOrders, setOrderContents} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

export default function CompletedOrdersList() {

    const dispatch = useDispatch()
    const completedOrders = useSelector(selectCompletedOrders)
    const router = useRouter()

    let tempArray = [<option onClick={() => dispatch(setOrderContents(null))} key={0}>Select Order</option>]
    console.log(Object.keys(completedOrders![Number(router.query.index)]))
    Object.values(completedOrders![Number(router.query.index)]).forEach((value,index) => {
        for(let i = 0; i < value.length; i++) {
            tempArray.push(
                <option onClick={() => dispatch(setOrderContents(value[i]))}
                        key={value[i].id! + i}>{value[i].id}</option>
            )
        }
    })
    if(router.query.index) {
        return (
            <div className={styles["shop-orders-table-containers"]}>
                Completed Order: <select>{tempArray}</select>
            </div>
        )
    } else {
        return null
    }
}