import {MarginItem} from "../../../store/margin-calculator-slice";
import useUpdateItemAndCalcMargins from "../use-update-item-and-calc-margins";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function CopyFromShopButton({item}: { item: MarginItem }) {

    const updateItem = useUpdateItemAndCalcMargins()

    return <button onClick={async () => {
        let update = {
            ...item.prices,
            ebay: item.prices.shop,
            amazon: item.prices.shop,
            magento: item.prices.shop,
            onbuy: item.prices.shop
        }
        await updateItem(item, "prices", update)
        dispatchNotification()
    }}>Copy prices from RRP</button>
}