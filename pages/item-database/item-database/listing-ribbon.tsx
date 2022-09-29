import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"

export default function ListingRibbon() {

    const item = useSelector(selectItem)

    function radioButtons(channel) {
        return (
            <>
                <label style={item.CHECK.NA[channel] === true ? {color: "var(--primary-color)"} : null}
                       htmlFor={channel + "1"}>N/A</label>
                <input defaultChecked={item.CHECK.NA[channel]} type={"radio"} id={channel + "1"} name={channel}/>
                <label style={item.CHECK.READY[channel] === true ? {color: "var(--primary-color)"} : null}
                       htmlFor={channel + "2"}>Ready</label>
                <input defaultChecked={item.CHECK.READY[channel]} type={"radio"} id={channel + "2"} name={channel}/>
                <label style={item.CHECK.DONE[channel] === true ? {color: "var(--primary-color)"} : null}
                       htmlFor={channel + "3"}>Done</label>
                <input defaultChecked={item.CHECK.DONE[channel]} type={"radio"} id={channel + "3"} name={channel}/>
            </>
        )
    }

    return (
        <div className={styles["item-details-status"]}>
            <span>
                <div>eBay: </div>
                <div>Amazon: </div>
                <div>Quay Sports: </div>
            </span>
            <span>
                <div> {radioButtons("EBAY")}</div>
                <div> {radioButtons("AMAZON")}</div>
                <div> {radioButtons("QS")}</div>
            </span>
        </div>
    )
}