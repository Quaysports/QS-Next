import {Rota, UserHours} from "../../../../server-modules/rotas/rotas";
import styles from "../rotas.module.css";
import {useDispatch} from "react-redux";
import {updateTemplate} from "../../../../store/dashboard/rotas-slice";

export default function PublishSidebar({rota, editable = true}: { rota: Rota, editable?: boolean }) {

    if(!rota) return null

    let days = []
    for (let i in rota.rota) {
        days.push(<RotaDay key={i} dayOfWeek={Number(i)} userHours={rota.rota[i]} editable={editable}/>)
    }

    return <div className={styles["week"]}>{days}</div>
}


function RotaDay({dayOfWeek, userHours, editable}: { dayOfWeek: number, userHours: UserHours[], editable: boolean }) {

    if(!userHours) return null

    let userRows = []

    for (let i in userHours) {
        userRows.push(<UserRow key={i} userIndex={Number(i)} userHours={userHours[i]} dayOfWeek={dayOfWeek} editable={editable}/>)
    }

    return (
        <div className={styles["day"]}>
            <div className={styles["day-sidebar-row"]}>
                <div className={styles["day-cell"]}>Notes</div>
            </div>
            {userRows}
        </div>
    )
}

function UserRow({userIndex, userHours, dayOfWeek, editable}: { userIndex: number, userHours: UserHours, dayOfWeek: number, editable: boolean }) {

    if(!userHours) return null

    const dispatch = useDispatch()

    return (
        <div className={styles["day-sidebar-row"]}>
            <div className={styles["day-cell"]}>
                {editable ?
                    <input defaultValue={userHours.notes}
                           onBlur={(e)=>{
                    let newUserHours = {...userHours}
                    newUserHours.notes = e.target.value
                    dispatch(updateTemplate({index: userIndex, day: dayOfWeek, userHours: newUserHours}))
                }}/> : <div className={styles.notes}>{userHours.notes}</div>}
            </div>
        </div>
    )
}