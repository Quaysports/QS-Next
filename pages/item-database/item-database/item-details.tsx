import ColumnLayout from "../../../components/layouts/column-layout";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import StatusRibbon from "./status-ribbon";
import EssentialsRibbon from "./essentials-ribbon";
import LinkedSKURibbon from "./linked-sku-ribbon";

export default function ItemDetails(){

    const item = useSelector(selectItem)

    return (
        <ColumnLayout background={false}>
            <div className={`${styles["details-sections"]} center-align`}>{item?.TITLE ? item.TITLE: ""} Details</div>
            <div className={styles["details-sections"]}>
                <div>Status</div>
                <StatusRibbon/>
            </div>
            <div className={styles["details-sections"]}>
                <div>Essentials</div>
                <EssentialsRibbon/>
            </div>
            <div className={styles["details-sections"]}>
                <div>Descriptions</div>
            </div>
            <div className={styles["details-sections"]}>
                <div>Images</div>
            </div>
            <div className={styles["details-sections"]}>
                <div>Amazon Props</div>
            </div>
            <div className={styles["details-sections"]}>
                <div>Linked SKUs</div>
                <LinkedSKURibbon/>
            </div>
            <div className={styles["details-sections"]}>
                <div>Shipping</div>
            </div>
        </ColumnLayout>
    )
}