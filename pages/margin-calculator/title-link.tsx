import {useDispatch, useSelector} from "react-redux";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {MarginCalcTables} from "../../server-modules/users/user";
import {selectMarginSettings, updateMarginSetting} from "../../store/session-slice";

export default function TitleLink({type}: { type: string }) {

    const dispatch = useDispatch()
    const settings = useSelector(selectMarginSettings)

    return <div>
        <div style={{width: "fit-content"}}
             onClick={() => {
                 let newSettings = structuredClone(settings!)
                 const key = `${type}Table` as keyof MarginCalcTables
                 newSettings.tables[key] = !newSettings.tables[key]
                 dispatch(updateMarginSetting(newSettings))
                 dispatchNotification()
             }}
             onMouseOver={(e) => dispatchNotification({type: "tooltip", content: "Click to hide", e: e})}
             onMouseLeave={() => dispatchNotification({type: undefined})}
        >{type}</div>
    </div>
}