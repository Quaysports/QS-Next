import RotaWeek from "../rota";
import {useDispatch, useSelector} from "react-redux";
import {saveTemplate, selectTemplate} from "../../../../store/dashboard/rotas-slice";
import styles from "../rotas.module.css";
import {useRef} from "react";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";

export default function CreateRota() {

    const template = useSelector(selectTemplate)
    const inputRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()

    if(!template) return null

    return (
        <div>
            <div className={styles.menu}>
                <button onClick={() => {}}>Delete</button>
                <button onClick={()=>{
                    dispatch(saveTemplate(inputRef.current && inputRef.current.value !== "" ? inputRef.current.value : Date.now().toString()))
                    dispatchNotification()
                    window.location.reload()
                }}>Save</button>
                <input type={"text"}
                       ref={inputRef}
                       placeholder={"Unique name"}
                       defaultValue={template.name}
                />
            </div>
        <div className={styles["rota-container"]}>

            <RotaWeek rota={template}  holiday={null} weekData={null}/>
        </div>
        </div>
    )
}