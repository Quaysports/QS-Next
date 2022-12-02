import styles from "./test-styles.module.css";
import {useSelector} from "react-redux";
import {selectPackaging, selectPostage} from "../../../store/margin-calculator-slice";
import {UpdateHandler} from "./margin-item-test-popup";

export default function SettingsTable({item, handler}: UpdateHandler) {
    const packaging = useSelector(selectPackaging)
    const postage = useSelector(selectPostage)
    return <>
        <div className={styles["settings-row"]}>
            <div>Purchase Price</div>
            <div>Packaging</div>
            <div>Cost</div>
            <div>Postage</div>
            <div>Cost</div>
            <div>Postage Modifier</div>
        </div>
        <div className={styles["settings-row"]}>
            <div className={styles["input-pound"]}>
                £
                <input type={"number"}
                       step={0.01}
                       min={0}
                       defaultValue={item.PURCHASEPRICE}
                       onBlur={(e) => handler("PURCHASEPRICE", parseFloat(e.target.value))}/>
            </div>
            <PackagingSelect handler={handler} item={item}/>
            <div>£{item.PACKGROUP && packaging?.[item.PACKGROUP] ? packaging[item.PACKGROUP].PRICE : "0.00"}</div>
            <PostSelect handler={handler} item={item}/>
            <div>£{item.POSTID && postage?.[item.POSTID]?.POSTCOSTEXVAT ? postage[item.POSTID].POSTCOSTEXVAT : "0.00"}</div>
            <PostModSelect handler={handler} item={item}/>
        </div>
    </>
}

function PackagingSelect({item, handler}: UpdateHandler) {
    const packaging = useSelector(selectPackaging)

    if (!packaging) return null

    const opts = []
    for (let type of Object.values(packaging)) {
        opts.push(<option key={type.ID} value={type.ID}>{type.NAME}</option>)
    }

    return <select defaultValue={item.PACKGROUP}
                   onChange={(e) => handler("PACKGROUP", e.target.value)}>{opts}</select>
}

function PostSelect({item, handler}: UpdateHandler) {

    const postage = useSelector(selectPostage)

    let opts = []
    for (let option of Object.values(postage!)) {
        opts.push(<option key={option.POSTID} value={option.POSTID}>{option.SFORMAT}</option>)
    }

    return <select defaultValue={item.POSTID}
                   onChange={async (e) => handler("POSTID", e.target.value)}>{opts}</select>
}

function PostModSelect({item, handler}: UpdateHandler) {

    let opts = []
    let mods = ['x2', 'x3', -3, -2, -1, -0.5, -0.25, -0.10, 0, 0.10, 0.25, 0.5, 1, 2, 3];
    for (let option of mods) {
        opts.push(<option key={option} value={option}>{option}</option>)
    }

    return <select defaultValue={item.POSTMODID}
                   onChange={async (e) => handler("POSTMODID", e.target.value)}>{opts}</select>
}