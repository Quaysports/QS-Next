import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalcMargins from "../use-update-item-and-calc-margins";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function CopyFromShopButton({item}: { item: MarginItem }) {

    const updateItem = useUpdateItemAndCalcMargins()

    return <button onClick={async () => {
        let clone = {
            ...item,
            ...{
                AMZPRICEINCVAT: item.SHOPPRICEINCVAT,
                EBAYPRICEINCVAT: item.SHOPPRICEINCVAT,
                QSPRICEINCVAT: item.SHOPPRICEINCVAT
            }
        }
        await updateItem(clone)
        dispatchNotification()
    }}>Copy prices from RRP</button>
}