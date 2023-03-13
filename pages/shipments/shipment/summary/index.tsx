import styles from "../../shipment.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectShipment, updateShipment} from "../../../../store/shipments-slice";
import RegexInput from "../../../../components/regex-input";
import { Shipment } from "../../../../server-modules/shipping/shipping";

export default function Summary() {
    const shipment = useSelector(selectShipment)

    if (!shipment) return null

    return <div className={styles["shipment-sub-table"]}>
        <SummaryRow title={"Sub Total"} currency={shipment.subTotal} exchangeRate={shipment.exchangeRate}/>
        <InputRow title={"Credit from Last Order"} shipmentKey={"credit"} shipment={shipment} />
        <SummaryRow title={"Total"} currency={shipment.total} exchangeRate={shipment.exchangeRate}/>
        <SummaryRow title={"30% Deposit Required"} currency={shipment.depReq} exchangeRate={shipment.exchangeRate}/>
        <SummaryRow title={"Outstanding"} currency={shipment.outstanding} exchangeRate={shipment.exchangeRate}/>
        <InputRow title={"Shipping"} shipmentKey={"shipping"} shipment={shipment} />
        <SummaryRow title={"Duty"} currency={shipment.duty} exchangeRate={shipment.exchangeRate}/>
        <InputRow title={"Bank Charges"} shipmentKey={"bankCharges"} shipment={shipment} />
        <SummaryRow title={"Total Ex. VAT"} currency={shipment.totalExVat}/>
        <SummaryRow title={"VAT"} currency={shipment.vat}/>
        <SummaryRow title={"Grand Total"} currency={shipment.grandTotal}/>
    </div>
}

function SummaryRow({title, currency, exchangeRate}:{title:string, currency:number, exchangeRate?:number}) {
    const dollarLabel = currency && exchangeRate ? '$'+currency.toFixed(2) : ""
    const poundLabel = currency && exchangeRate
        ? (currency / exchangeRate).toFixed(2)
        : currency.toFixed(2)
    return <div className={`${styles["summary-item-row"]}`}>
        <div>{title}</div>
        <div>{dollarLabel}</div>
        <div></div>
        <div>£{poundLabel}</div>
        <div></div>
    </div>
}

function InputRow({title, shipmentKey, shipment}:{title:string, shipmentKey:"credit" | "shipping" | "bankCharges", shipment:Shipment}) {
    const dispatch = useDispatch()
    function update<T>(obj: T, key: keyof T, value: T[keyof T]) {
        let update = structuredClone(obj)
        update[key] = value
        return update
    }

    if (!shipment) return null
    return <div className={`${styles["summary-item-row"]}`}>
        <div>{title}</div>
        <div></div>
        <div></div>
        <div><RegexInput type={"decimal"} value={shipment[shipmentKey] as number} handler={(value) => {
            dispatch(updateShipment(update<Shipment>(shipment, shipmentKey, Number(value))))
        }} errorMessage={"Pound value only"}/></div>
        <div></div>
    </div>
}