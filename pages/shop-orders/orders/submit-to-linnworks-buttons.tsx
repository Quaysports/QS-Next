import * as React from "react"
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectLoadedOrder, setCompleteOrder, setSubmittedOrder} from "../../../store/shop-orders-slice";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

export interface SubmitToLinnworksButtonsProps {
    supplierFilter: () => void
}

/**
 * Submit To Linnworks Buttons Component
 * Builds and contains all the functionality of submit and complete order buttons
 */
export default function SubmitToLinnworksButtons(props: SubmitToLinnworksButtonsProps) {

    const loadedOrder = useSelector(selectLoadedOrder)
    const dispatch = useDispatch()

    async function submitToLinnworks() {
            let data = []
            for (let item of loadedOrder!.arrived) {
                if (item.qty > 0 && !item.submitted && !item.newProduct) {
                    data.push({SKU: item.SKU, QTY: item.tradePack * item.qty})
                }
            }

            if (data.length > 0) {
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify({QUERY:loadedOrder!.id, DATA: data})
                }
                await fetch("/api/shop-orders/adjust-stock", opts)
                    .then(res => res.json())
                    .then(res => {dispatch(setSubmittedOrder(res))})

                } else {
                dispatchNotification({type:"alert", title: "Error", content:"Nothing to book in! Check for zero ordered quantities"})
            }
        }


    function completeOrder() {
        if (loadedOrder!.order.length > 0) {
            dispatchNotification({
                type: "confirm",
                title: "Complete Order",
                content: "Not all items in this order have been booked in, completing this will delete the rest of the order. Are you sure you want to continue?",
                fn: () => {dispatch(setCompleteOrder()); props.supplierFilter()}
            })
        } else {
            dispatch(setCompleteOrder())
            props.supplierFilter()
        }
    }

    return (
        <span className={styles["primary-buttons"]}>
                    <button onClick={submitToLinnworks}>Submit To Linnworks</button>
                    <button onClick={completeOrder}>Complete Order</button>
                </span>
    )
}