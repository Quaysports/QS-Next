import ColumnLayout from "../../../components/layouts/column-layout";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import ListingRibbon from "./listing-ribbon";

export default function ItemDetails(){

    const item = useSelector(selectItem)
    return (
        <ColumnLayout>
            <div className={"center-align"}>{item.TITLE} Details</div>
            <div className={styles["details-sections"]}>
                <div>Status</div>
                <ListingRibbon/>
            </div>
            <div className={styles["details-sections"]}>Essentials</div>
            <div className={styles["details-sections"]}>Descriptions</div>
            <div className={styles["details-sections"]}>Images</div>
            <div className={styles["details-sections"]}>Amazon Props</div>
            <div className={styles["details-sections"]}>Shipping</div>
        </ColumnLayout>
    )
}