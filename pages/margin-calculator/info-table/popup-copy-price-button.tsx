import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalcMargins from "../use-update-item-and-calc-margins";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

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
        dispatchNotification({type:undefined})
    }}>Copy prices from RRP</button>
}