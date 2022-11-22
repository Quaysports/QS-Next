import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemChannelStatus} from "../../../../store/item-database/item-database-slice";

interface Props {
    channel: string
}

export default function ChannelRadioButtons({channel}:Props) {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function channelButtonsHandler(channel:string, status:keyof sbt.statusChecks) {
        dispatch(setItemChannelStatus({channel:channel, status:status}))
    }

    let checked:string = ""
    if(item?.CHECK?.NA[channel as keyof sbt.statusChecks["NA"]]) checked = "na"
    if(item?.CHECK?.READY[channel as keyof sbt.statusChecks["READY"]]) checked = "ready"
    if(item?.CHECK?.DONE[channel as keyof sbt.statusChecks["DONE"]]) checked = "done"
    return (
        <div>
            <label style={checked === "na" ? {color: "var(--primary-color)"} : undefined}
                   htmlFor={channel + "1"}>N/A</label>
            <input checked={item?.CHECK?.NA[channel as keyof sbt.statusChecks["NA"]]}
                   type={"radio"}
                   id={channel + "1"}
                   name={channel}
                   onChange={(e) => {channelButtonsHandler(channel, "NA")}}/>
            <label style={checked === "ready" ? {color: "var(--primary-color)"} : undefined}
                   htmlFor={channel + "2"}>Ready</label>
            <input checked={item?.CHECK?.READY[channel as keyof sbt.statusChecks["READY"]]}
                   type={"radio"}
                   id={channel + "2"}
                   name={channel}
                   onChange={(e) => {channelButtonsHandler(channel, "READY")}}/>
            <label style={checked === "done" ? {color: "var(--primary-color)"} : undefined}
                   htmlFor={channel + "3"}>Done</label>
            <input checked={item?.CHECK?.DONE[channel as keyof sbt.statusChecks["DONE"]]}
                   type={"radio"}
                   id={channel + "3"}
                   name={channel}
                   onChange={(e) => {channelButtonsHandler(channel, "DONE")}}/>
        </div>
    )
}
