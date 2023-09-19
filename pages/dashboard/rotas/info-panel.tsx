import {Rota} from "../../../server-modules/rotas/rotas";
import styles from "./rotas.module.css";

export default function InfoPanel({rota}:{rota:Rota}) {

    if(!rota) return null;

    let hours = rota.rota.reduce((acc:{[key:string]:number}, val) => {
        for(let user of val) {
            if(!acc[user.username]) acc[user.username] = 0
            acc[user.username] += user.total
        }
        return acc
    },{})

    let userHours = [<div key={"info"} className={styles["info-panel-row"]}>
        <div className={styles["info-panel-title"]}>Total Hours</div></div>]
    for(let [k,v] of Object.entries(hours)) {
        userHours.push(<div key={k} className={styles["info-panel-row"]}>
            <div className={styles["day-cell"]}>{k}</div>
            <div className={styles["day-cell"]}>{v}</div>
        </div>)
    }

    return <div className={styles["info-panel"]}>
        {userHours}
    </div>
}