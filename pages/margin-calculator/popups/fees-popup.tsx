import {selectFees, updateFees} from "../../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";
import styles from "../margin-calculator.module.css"
import {Fees} from "../../../server-modules/fees/fees";
import {MenuState} from "./margin-menu-popup";
import {ChangeEvent} from "react";

export default function FeesMenu({menuState}: { menuState: MenuState }) {

    const fees = useSelector(selectFees)
    const dispatch = useDispatch()

    if (!fees) return null

    return <div className={styles["fees-table"]}>
        <TitleRow/>
        <ItemRow channel={"AMAZ"} fees={fees} title={"Amazon"} menuState={menuState}/>
        <ItemRow channel={"EBAY"} fees={fees} title={"Ebay"} menuState={menuState}/>
        <ItemRow channel={"QS"} fees={fees} title={"Quaysports"} menuState={menuState}/>
        <ItemRow channel={"SHOP"} fees={fees} title={"Shop"} menuState={menuState}/>
        <div className={styles["fees-row"]}>
            <div>VAT</div>
            <div><input type={"number"} step={"0.01"} min={0} defaultValue={fees?.VAT} onChange={(e) => {
                let newFees = structuredClone(fees)
                newFees.VAT = parseFloat(e.target.value)
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
    title: string
    channel: "AMAZ" | "EBAY" | "QS" | "SHOP"
    checkbox?:boolean
}

function ItemRow({fees, menuState, title, channel}: ItemRowProps) {

    const dispatch = useDispatch()
    const updateHandler = (e:ChangeEvent<HTMLInputElement>,
                           id:"LISTING" | "FLAT" | "SUBSCRIPTION" | "VATAPP" ,
                           channel:"AMAZ" | "EBAY" | "QS" | "SHOP",
                           checkbox = false)=>{
        let newFees = structuredClone(fees)
        checkbox
            ? newFees[id][channel] = e.target.checked
            : newFees[id][channel] = e.target.value;
        dispatch(updateFees(newFees))
        menuState.updateRequired = true
    }

    return <div className={styles["fees-row"]}>
        <div>{title}</div>
        <div>
            <input type={"number"}
                   step={"0.01"}
                   min={0}
                   defaultValue={fees?.LISTING[channel]}
                   onChange={(e) => { updateHandler(e, "LISTING", channel)}}/>
        </div>
        <div>
            <input type={"number"}
                    step={"0.01"}
                    min={0}
                    defaultValue={fees?.FLAT[channel]}
                    onChange={(e) => { updateHandler(e, "FLAT", channel)}}/>
        </div>
        <div>
            <input type={"number"}
                   step={"0.01"}
                   min={0}
                   defaultValue={fees?.SUBSCRIPTION[channel]}
                   onChange={(e) => { updateHandler(e, "SUBSCRIPTION", channel)}}/>
        </div>
        <div>
            <input type={"checkbox"}
                   defaultChecked={fees?.VATAPP[channel]}
                   onChange={(e) => { updateHandler(e, "VATAPP", channel, true)}}/>
        </div>
    </div>
}