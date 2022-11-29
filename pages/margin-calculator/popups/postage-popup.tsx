import {useDispatch, useSelector} from "react-redux";
import {selectPostage, updatePostage} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css"
import {Postage} from "../../../server-modules/postage/postage";
import {MenuState} from "./margin-menu-popup";
import {ChangeEvent} from "react";

export default function PostageMenu({menuState}: { menuState: MenuState }){
    const postage = useSelector(selectPostage)
    const dispatch = useDispatch()

    const updateHandler = (e: ChangeEvent<HTMLInputElement>, postage: Postage, text = false)=> {
        let newPostage = structuredClone(postage)
        text
            ? newPostage.SFORMAT = e.target.value
            : newPostage.POSTCOSTEXVAT = parseFloat(e.target.value);
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
                   defaultValue={postage.POSTCOSTEXVAT}
                   onChange={(e)=>updateHandler(e,postage)}/>
        </div>
        <div>
            <input type={"text"}
                   defaultValue={postage.SFORMAT}
                   onChange={(e)=>updateHandler(e,postage, true)}/>
        </div>
        <div>{postage.POSTALFORMAT}</div>
    </div>
}