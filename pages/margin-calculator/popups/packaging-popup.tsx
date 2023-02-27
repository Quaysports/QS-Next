import {useDispatch, useSelector} from "react-redux";
import {selectPackaging, updatePackaging} from "../../../store/margin-calculator-slice";
import styles from "./popup-styles.module.css"
import {Packaging} from "../../../server-modules/packaging/packaging";
import {MenuState} from "./margin-menu-popup";
import {ChangeEvent} from "react";
import {currencyToLong, toCurrencyInput} from "../../../components/utils/utils";

export default function PackagingMenu({menuState}: { menuState: MenuState }){
    const packaging = useSelector(selectPackaging)
    const dispatch = useDispatch()

    const updateHandler = (e: ChangeEvent<HTMLInputElement>, packaging: Packaging)=> {
        let newPackaging = structuredClone(packaging)
        newPackaging.price = currencyToLong(e.target.value)
        dispatch(updatePackaging(newPackaging))
        menuState.updateRequired = true
    }

    if(!packaging) return null

    let elements = []
    for(let [k,v] of Object.entries(packaging)){
        elements.push(<ItemRow key={k} packaging={v} updateHandler={updateHandler}/>)
    }

    return <div className={styles["packaging-table"]}>{elements}</div>
}

function ItemRow({packaging, updateHandler}:{packaging:Packaging, updateHandler:(e: ChangeEvent<HTMLInputElement>, packaging: Packaging)=>void}){
    return <div className={styles["packaging-row"]}>
        <div>{packaging.name}</div>
        <div>£<input type={"number"} step={0.01} min={0} defaultValue={toCurrencyInput(packaging.price)} onChange={(e)=>updateHandler(e, packaging)}/></div>
    </div>
}