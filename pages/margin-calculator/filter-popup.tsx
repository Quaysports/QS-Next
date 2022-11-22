import {useDispatch, useSelector} from "react-redux";
import styles from './margin-calculator.module.css'
import {selectMarginSettings, updateMarginSetting} from "../../store/session-slice";
import {MarginCalcTables} from "../../server-modules/users/user";

export default function MarginCalculatorFilters() {

    const dispatch = useDispatch()
    const settings = useSelector(selectMarginSettings)

    const elements = []
    for (let [k, v] of Object.entries(settings!.tables)) {
        elements.push(
            <label>
                <input key={k}
                       type={"checkbox"}
                       checked={v}
                       onChange={() => {
                           let newSettings = structuredClone(settings!)
                           newSettings.tables[k as keyof MarginCalcTables] = !v
                           console.log(newSettings)
                           dispatch(updateMarginSetting(newSettings))
                       }}/>{k.replace("Table", "")}</label>
        )
    }
    return <div className={styles.filters}>{elements}</div>
}