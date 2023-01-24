import RotaWeek from "../rota";
import {useDispatch, useSelector} from "react-redux";
import {saveTemplate, selectTemplate} from "../../../../store/dashboard/rotas-slice";
import styles from "../rotas.module.css";
import {useRef} from "react";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import InfoPanel from "../info-panel";

export default function CreateRota() {

    const template = useSelector(selectTemplate)
    const inputRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()

    if(!template) return null

    return (
        <div>
            <div className={styles.menu}>
                <button onClick={() => {
                    let opts = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(template)
                    }
                    fetch("/api/rotas/delete-template", opts).then(()=>global.window.location.reload())

                }}>Delete</button>
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
            <InfoPanel rota={template}/>
            <RotaWeek rota={template}  holiday={null} weekData={null}/>
        </div>
        </div>
    )
}