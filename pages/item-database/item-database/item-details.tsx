import ColumnLayout from "../../../components/layouts/column-layout";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import StatusRibbon from "./status-ribbon";
import EssentialsRibbon from "./essentials-ribbon";

export default function ItemDetails(){

    const item = useSelector(selectItem)

    return (
        <ColumnLayout background={false}>
            <div className={"center-align"}>{item?.TITLE ? item.TITLE: ""} Details</div>
            <div className={styles["details-sections"]}>
                <div>Status</div>
                <StatusRibbon/>
            </div>
            <div className={styles["details-sections"]}>
                <div>Essentials</div>
                <EssentialsRibbon/>
            </div>
            <div className={styles["details-sections"]}>Descriptions</div>
            <div className={styles["details-sections"]}>Images</div>
            <div className={styles["details-sections"]}>Amazon Props</div>
            <div className={styles["details-sections"]}>Shipping</div>
        </ColumnLayout>
    )
}