import styles from "../../item-database.module.css"
import StatusCheckboxes from "./status-checkbox";
import ChannelRadioButtons from "./channel-radio-buttons";

/**
 * Status Ribbon Component
 */
export default function StatusRibbon() {

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
                <StatusCheckboxes title={"GOODRCVD"}/>
                <StatusCheckboxes title={"ADDINV"}/>
                <StatusCheckboxes title={"EAN"}/>
                <StatusCheckboxes title={"PHOTOS"}/>
                <StatusCheckboxes title={"MARGIN"}/>
            </span>
            <span className={styles["status-titles"]}>
                <div>eBay: </div>
                <div>Amazon: </div>
                <div>Quay Sports: </div>
            </span>
            <span className={styles["status-inputs"]}>
                <ChannelRadioButtons channel={"EBAY"}/>
                <ChannelRadioButtons channel={"AMAZON"}/>
                <ChannelRadioButtons channel={"QS"}/>
            </span>
        </div>
    )
}