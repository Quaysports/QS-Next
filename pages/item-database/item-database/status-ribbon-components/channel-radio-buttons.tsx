import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemChannelStatus} from "../../../../store/item-database/item-database-slice";

interface Props {
    channel: string
}

export default function ChannelRadioButtons({channel}:Props) {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function channelButtonsHandler(channel:string, status:keyof schema.CheckboxStatus) {
        dispatch(setItemChannelStatus({channel:channel, status:status}))
    }

    let checked:string = ""
    if(item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus]) checked = "na"
    if(item.checkboxStatus.ready[channel as keyof schema.ReadyStatus]) checked = "ready"
    if(item.checkboxStatus.done[channel as keyof schema.DoneStatus]) checked = "done"

    return (
        <div>
            <label style={checked === "na" ? {color: "var(--primary-color)"} : undefined}
                   htmlFor={channel + "1"}>N/A</label>
            <input checked={item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus]}
                   type={"radio"}
                   id={channel + "1"}
                   name={channel}
                   onChange={() => {channelButtonsHandler(channel, "notApplicable")}}/>
            <label style={checked === "ready" ? {color: "var(--primary-color)"} : undefined}
                   htmlFor={channel + "2"}>Ready</label>
            <input checked={item.checkboxStatus.ready[channel as keyof schema.ReadyStatus]}
                   type={"radio"}
                   id={channel + "2"}
                   name={channel}
                   onChange={() => {channelButtonsHandler(channel, "ready")}}/>
            <label style={checked === "done" ? {color: "var(--primary-color)"} : undefined}
                   htmlFor={channel + "3"}>Done</label>
            <input checked={item.checkboxStatus.done[channel as keyof schema.DoneStatus]}
                   type={"radio"}
                   id={channel + "3"}
                   name={channel}
                   onChange={() => {channelButtonsHandler(channel, "done")}}/>
        </div>
    )
}
