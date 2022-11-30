import ColumnLayout from "../../../components/layouts/column-layout";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import StatusRibbon from "./status-ribbon-components";
import EssentialsRibbon from "./essentials-ribbon-components";
import LinkedSKURibbon from "./linked-sku-ribbon-components";
import AmazonPropsRibbon from "./amazon-props-ribbon-components";
import DescriptionsRibbon from "./descriptions-ribbon-components";
import ImagesRibbon from "./images-ribbon-components";

/**
 * Item Details Component
 */
export default function ItemDetails(){

    const item = useSelector(selectItem)

    return (
        <ColumnLayout background={false} scroll={true} height={80}>
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
                <ImagesRibbon/>
            </div>
            <div className={styles["details-sections"]}>
                <div>Amazon Extended Properties</div>
                <AmazonPropsRibbon/>
            </div>
            {item.LINKEDSKUS.length != 0 ? <div className={styles["details-sections"]}>
                <div>Linked SKUs</div>
                <LinkedSKURibbon/>
            </div>  : null}
        </ColumnLayout>
    )
}