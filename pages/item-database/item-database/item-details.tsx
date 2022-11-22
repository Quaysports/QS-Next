import ColumnLayout from "../../../components/layouts/column-layout";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import StatusRibbon from "./status-ribbon-components";
import EssentialsRibbon from "./essentials-ribbon-components";
import LinkedSKURibbon from "./linked-sku-ribbon-components";
import AmazonPropsRibbon from "./amazon-props-components";
import DescriptionsRibbon from "./descriptions-ribbon-components";

/**
 * Item Details Component
 */
export default function ItemDetails(){

    const item = useSelector(selectItem)

    return (
        <ColumnLayout background={false} scroll={true}>
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
                <DescriptionsRibbon/>
            </div>
            <div className={styles["details-sections"]}>
                <div>Images</div>
            </div>
            <div className={styles["details-sections"]}>
                <div>Amazon Extended Properties</div>
                <AmazonPropsRibbon/>
            </div>
            {item?.LINKEDSKUS ? <div className={styles["details-sections"]}>
                <div>Linked SKUs</div>
                <LinkedSKURibbon/>
            </div>  : null}
            <div className={styles["details-sections"]}>
                <div>Shipping</div>
            </div>
        </ColumnLayout>
    )
}