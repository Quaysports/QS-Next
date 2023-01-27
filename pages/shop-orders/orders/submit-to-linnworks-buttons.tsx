import * as React from "react"
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {
    selectOpenOrders,
    setCompleteOrder,
    setSubmittedOrder
} from "../../../store/shop-orders-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useRouter} from "next/router";
import {selectUser} from "../../../store/session-slice";

/**
 * Submit To Linnworks Buttons Component
 * Builds and contains all the functionality of submit and complete order buttons
 */
export default function SubmitToLinnworksButtons() {

    const user = useSelector(selectUser)
    const router = useRouter()
    const orders = useSelector(selectOpenOrders)
    const loadedOrder = orders ? orders[Number(router.query.index)] : null
    const dispatch = useDispatch()

    async function submitToLinnworks() {
        let data = []
        for (let item of loadedOrder!.arrived) {
            if (item.quantity > 0 && !item.submitted && !item.newProduct) {
                data.push({SKU: item.SKU, quantity: item.tradePack * item.quantity})
            }
        }

        if (data.length > 0) {
            const opts = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                },
                body: JSON.stringify({QUERY: loadedOrder!.id, DATA: data})
            }
            await fetch("/api/shop-orders/adjust-stock", opts)
                .then(res => res.json())
                .then(res => {
                    dispatch(setSubmittedOrder({res:res, order: router.query.index as string}))
                })

        } else {
            dispatchNotification({
                type: "alert",
                title: "Error",
                content: "Nothing to book in! Check for zero ordered quantities"
            })
        }
    }


    function completeOrder() {
        let notSubmitted: boolean = false
        for(const item of loadedOrder!.arrived){
            if(!item.submitted) notSubmitted = true
        }
        if(notSubmitted){
            dispatchNotification({
                type: "alert",
                title: "Items Not Submitted",
                content: "Some items that have arrived have not been submitted to Linnworks, either submit them or remove them from arrived list"
            })
        } else {
            if (loadedOrder!.order.length > 0) {
                dispatchNotification({
                    type: "confirm",
                    title: "Confirm Complete Order",
                    content: "Not all items in this order have been booked in, completing this will delete the rest of the order. Are you sure you want to continue?",
                    fn: () => {
                        dispatch(setCompleteOrder({index:router.query.index as string,user:user.username }));
                        router.push({pathname: "/shop-orders", query: {tab: "orders"}})
                    }
                })
            } else {
                dispatch(setCompleteOrder({index:router.query.index as string,user:user.username }))
                router.push({pathname: "/shop-orders", query: {tab: "orders"}})
            }
        }
    }

    return (
        <span className={styles["primary-buttons"]}>
            <button onClick={completeOrder}>Complete Order</button>
            <button onClick={submitToLinnworks}>Submit To Linnworks</button>
        </span>
    )
}