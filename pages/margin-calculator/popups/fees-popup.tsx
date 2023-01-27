import {selectFees, updateFees} from "../../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";
import styles from "./popup-styles.module.css"
import {Fees} from "../../../server-modules/fees/fees";
import {MenuState} from "./margin-menu-popup";
import {ChangeEvent} from "react";
import {currencyToLong, toCurrencyInput} from "../../../components/margin-calculator-utils/utils";

export default function FeesMenu({menuState}: { menuState: MenuState }) {

    const fees = useSelector(selectFees)
    const dispatch = useDispatch()

    if (!fees) return null

    return <div className={styles["fees-table"]}>
        <TitleRow/>
        <ItemRow fees={fees} menuState={menuState} channel={"amazon"} />
        <ItemRow fees={fees} menuState={menuState} channel={"ebay"} />
        <ItemRow fees={fees} menuState={menuState} channel={"magento"} />
        <ItemRow fees={fees} menuState={menuState} channel={"shop"} />
        <div className={styles["fees-row"]}>
            <div>VAT</div>
            <div><input type={"number"} step={"0.01"} min={0} defaultValue={toCurrencyInput(fees?.VAT)} onChange={(e) => {
                let newFees = structuredClone(fees)
                newFees.VAT = currencyToLong(e.target.value)
                dispatch(updateFees(newFees))
                menuState.updateRequired = true
            }}/></div>
        </div>
    </div>
}

function TitleRow() {
    return <div className={styles["fees-row"]}>
        <div>Channel</div>
        <div>Percentage</div>
        <div>Flat Rate</div>
        <div>Subscription</div>
        <div>Vat Applicable</div>
    </div>
}

interface ItemRowProps {
    fees: Fees
    menuState: MenuState
    channel: "amazon" | "ebay" | "magento" | "shop"
    checkbox?:boolean
}

function ItemRow({fees, menuState, channel}: ItemRowProps) {

    const dispatch = useDispatch()
    const updateHandler = (e:ChangeEvent<HTMLInputElement>,
                           id:"listing" | "flat" | "subscription" | "vatApplicable" ,
                           channel:"amazon" | "ebay" | "magento" | "shop",
                           checkbox = false)=>{
        let newFees = structuredClone(fees)
        checkbox
            ? newFees[id][channel] = e.target.checked
            : newFees[id][channel] = currencyToLong(e.target.value);
        dispatch(updateFees(newFees))
        menuState.updateRequired = true
    }

    return <div className={styles["fees-row"]}>
        <div style={{textTransform:"capitalize"}}>{channel}</div>
        <div>
            <input type={"number"}
                   step={"0.01"}
                   min={0}
                   defaultValue={toCurrencyInput(fees?.listing[channel])}
                   onChange={(e) => { updateHandler(e, "listing", channel)}}/>
        </div>
        <div>
            <input type={"number"}
                    step={"0.01"}
                    min={0}
                    defaultValue={toCurrencyInput(fees?.flat[channel])}
                    onChange={(e) => { updateHandler(e, "flat", channel)}}/>
        </div>
        <div>
            <input type={"number"}
                   step={"0.01"}
                   min={0}
                   defaultValue={toCurrencyInput(fees?.subscription[channel])}
                   onChange={(e) => { updateHandler(e, "subscription", channel)}}/>
        </div>
        <div>
            <input type={"checkbox"}
                   defaultChecked={fees?.vatApplicable[channel]}
                   onChange={(e) => { updateHandler(e, "vatApplicable", channel, true)}}/>
        </div>
    </div>
}