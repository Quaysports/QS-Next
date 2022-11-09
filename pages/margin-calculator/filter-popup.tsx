import {useDispatch, useSelector} from "react-redux";
import {selectTableToggles, toggleTable} from "../../store/margin-calculator-slice";
import styles from './margin-calculator.module.css'

export default function MarginCalculatorFilters(){

    const dispatch = useDispatch()
    const filters = useSelector(selectTableToggles)

    const elements = []
    for(let [k,v] of Object.entries(filters)){
        elements.push(
            <label>
                <input
                    type={"checkbox"}
                    checked={v}
                    onChange={(e)=>dispatch(toggleTable(k))}/>{k.replace("Table", "")}</label>
        )
    }
    return <div className={styles.filters}>{elements}</div>
}