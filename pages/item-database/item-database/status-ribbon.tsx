import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"

export default function StatusRibbon() {

    const item = useSelector(selectItem)

    function statusCheckboxes(title){
        return (
            <input defaultChecked={item?.CHECK?.DONE[title]} type={"checkbox"}/>
        )
    }

    function radioButtons(channel) {
        let checked
        if(item?.CHECK?.NA[channel]) checked = "na"
        if(item?.CHECK?.READY[channel]) checked = "ready"
        if(item?.CHECK?.DONE[channel]) checked = "done"
        return (
            <>
                <label style={checked === "na" ? {color: "var(--primary-color)"} : null}
                       htmlFor={channel + "1"}>N/A</label>
                <input defaultChecked={item?.CHECK?.NA[channel]} type={"radio"} id={channel + "1"} name={channel}/>
                <label style={checked === "ready" ? {color: "var(--primary-color)"} : null}
                       htmlFor={channel + "2"}>Ready</label>
                <input defaultChecked={item?.CHECK?.READY[channel]} type={"radio"} id={channel + "2"} name={channel}/>
                <label style={checked === "done" ? {color: "var(--primary-color)"} : null}
                       htmlFor={channel + "3"}>Done</label>
                <input defaultChecked={item?.CHECK?.DONE[channel]} type={"radio"} id={channel + "3"} name={channel}/>
            </>
        )
    }

    return (
        <div className={styles["item-details-status"]}>
            <span className={styles["status-titles"]}>
                <div>Goods received</div>
                <div>Added to inventory</div>
                <div>EAN assigned</div>
                <div>Images uploaded</div>
                <div>Margins calculated</div>
            </span>
            <span className={styles["status-inputs"]}>
                <div>{statusCheckboxes("GOODRCVD")}</div>
                <div>{statusCheckboxes("ADDINV")}</div>
                <div>{statusCheckboxes("EAN")}</div>
                <div>{statusCheckboxes("PHOTOS")}</div>
                <div>{statusCheckboxes("MARGIN")}</div>
            </span>
            <span className={styles["status-titles"]}>
                <div>eBay: </div>
                <div>Amazon: </div>
                <div>Quay Sports: </div>
            </span>
            <span className={styles["status-inputs"]}>
                <div> {radioButtons("EBAY")}</div>
                <div> {radioButtons("AMAZON")}</div>
                <div> {radioButtons("QS")}</div>
            </span>
        </div>
    )
}