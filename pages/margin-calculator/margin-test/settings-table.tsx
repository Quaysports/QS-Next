import styles from "./test-styles.module.css";
import {useSelector} from "react-redux";
import {selectPackaging, selectPostage} from "../../../store/margin-calculator-slice";
import {UpdateHandler} from "./index";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function SettingsTable({item, handler}: UpdateHandler) {
    const packaging = useSelector(selectPackaging)
    const postage = useSelector(selectPostage)

    if (!item) return null

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
                       defaultValue={item.prices.purchase}
                       onBlur={(e) => {
                           const update = {...item.prices, purchase: parseFloat(e.target.value)}
                           handler("prices", update)
                       }}/>
            </div>
            <PackagingSelect handler={handler} item={item}/>
            <div>{packaging?.[item.packaging.group] ? toCurrency(packaging[item.packaging.group].price) : "£0.00"}</div>
            <PostSelect handler={handler} item={item}/>
            <div>{postage?.[item.postage.id]?.cost ? toCurrency(postage[item.postage.id].cost) : "£0.00"}</div>
            <PostModSelect handler={handler} item={item}/>
        </div>
    </>
}

function PackagingSelect({item, handler}: UpdateHandler) {
    const packaging = useSelector(selectPackaging)

    if (!packaging) return null

    const opts = []
    for (let type of Object.values(packaging)) {
        opts.push(<option key={type.id} value={type.id}>{type.name}</option>)
    }

    return <select defaultValue={item.packaging.group}
                   onChange={(e) => {
                       const update = {...item.packaging, group: e.target.value}
                       handler("packaging", update)
                   }}>{opts}</select>
}

function PostSelect({item, handler}: UpdateHandler) {

    const postage = useSelector(selectPostage)

    if (!postage) return null

    let opts = []
    for (let option of Object.values(postage!)) {
        opts.push(<option key={option.id} value={option.id}>{option.tag}</option>)
    }

    return <select defaultValue={item.postage.id}
                   onChange={(e) => {
                       const update = {...item.postage, id: e.target.value}
                       handler("postage", update)
                   }}>{opts}</select>
}

function PostModSelect({item, handler}: UpdateHandler) {

    let opts = []
    let mods = ['x2', 'x3', -3, -2, -1, -0.5, -0.25, -0.10, 0, 0.10, 0.25, 0.5, 1, 2, 3];
    for (let option of mods) {
        opts.push(<option key={option} value={option}>{option}</option>)
    }

    return <select defaultValue={item.postage.modifier}
                   onChange={async (e) => {
                       const update = {...item.postage, modifier: e.target.value}
                       handler("postage", update)
                   }}>{opts}</select>
}