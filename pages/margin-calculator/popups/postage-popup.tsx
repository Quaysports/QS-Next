import {useDispatch, useSelector} from "react-redux";
import {selectPostage, updatePostage} from "../../../store/margin-calculator-slice";
import styles from "./popup-styles.module.css"
import {Postage} from "../../../server-modules/postage/postage";
import {MenuState} from "./margin-menu-popup";
import {ChangeEvent} from "react";
import {currencyToLong, toCurrencyInput} from "../../../components/utils/utils";

export default function PostageMenu({menuState}: { menuState: MenuState }){
    const postage = useSelector(selectPostage)
    const dispatch = useDispatch()

    const updateHandler = (e: ChangeEvent<HTMLInputElement>, postage: Postage, text = false)=> {
        let newPostage = structuredClone(postage)
        text
            ? newPostage.tag = e.target.value
            : newPostage.cost = currencyToLong(e.target.value);
        dispatch(updatePostage(newPostage))
        menuState.updateRequired = true
    }

    if(!postage) return null

    let elements = []
    for(let [k,v] of Object.entries(postage)){
        elements.push(<ItemRow key={k} postage={v} updateHandler={updateHandler}/>)
    }

    return <div className={styles["postage-table"]}>{elements}</div>
}

function ItemRow({postage, updateHandler}:{
    postage:Postage,
    updateHandler:(e: ChangeEvent<HTMLInputElement>, postage: Postage, text?:boolean)=>void}){
    return <div className={styles["postage-row"]}>
        <div>£
            <input type={"number"}
                   step={0.01}
                   min={0}
                   defaultValue={toCurrencyInput(postage.cost)}
                   onChange={(e)=>updateHandler(e,postage)}/>
        </div>
        <div>
            <input type={"text"}
                   defaultValue={postage.tag}
                   onChange={(e)=>updateHandler(e,postage, true)}/>
        </div>
        <div>{postage.format}</div>
    </div>
}