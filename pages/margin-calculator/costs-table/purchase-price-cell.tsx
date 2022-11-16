import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import {MarginItem} from "../../../store/margin-calculator-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import styles from '../margin-calculator.module.css'

export default function PurchasePriceCell({item}:{item:MarginItem}){

    const tooltip = <div className={styles.tooltip}>
        <div>Linked to Linnworks Purchase Price.</div>
        <div>Change in Linnworks to update.</div>
        <div>--------------------------------------</div>
        <div>Click to open test item</div>
    </div>

    if(!item) return null

    return <div
        onMouseOver={(e) => {
            dispatchNotification({type: "tooltip", title: "Shop Margin Breakdown", content: tooltip, e: e})}}
        onMouseLeave={() => dispatchNotification({type: undefined})}
    >{toCurrency(item.PURCHASEPRICE)}</div>
}