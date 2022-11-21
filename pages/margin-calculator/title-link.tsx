import {useDispatch, useSelector} from "react-redux";
import {selectTableToggles, toggleTable} from "../../store/margin-calculator-slice";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

export default function TitleLink({type}:{type:string}){

    const dispatch = useDispatch()
    const filters = useSelector(selectTableToggles)

    return <div onClick={()=>{
                    dispatch(toggleTable(`${type}Table`))
                    dispatchNotification({type:undefined})
                }}
                onMouseOver={(e)=>dispatchNotification({type:"tooltip",content:"Click to hide", e:e})}
                onMouseLeave={()=>dispatchNotification({type:undefined})}
    >{type}</div>
}