import {useSelector} from "react-redux";
import {
    selectItem,
} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css"
import ItemLocation from "./location-selects";
import SuppliersSelect from "./supplier-select";
import BrandInput from "./brand-input";
import TitleInput from "./title-input";
import WebsiteTitleInput from "./website-title-input";

/**
 * Essentials Ribbon Component
 */

export default function EssentialsRibbon(){

    const item = useSelector(selectItem)

    return(
        <div className={styles["item-details-essentials"]}>
            <div className={styles["essentials-titles-1"]}>
                <div>Brand:</div>
                <div>SKU:</div>
                <div>EAN:</div>
                <div>Supplier:</div>
                <div>Stock Total:</div>
                <div>Location:</div>
                <div>Website Title:</div>
                <div>Linnworks Title:</div>
            </div>
            <div className={styles["essentials-inputs-1"]}>
                <BrandInput/>
                <div>{item.SKU}</div>
                <div>{item.EAN}</div>
                <SuppliersSelect/>
                <div>{item.STOCKTOTAL}</div>
                <ItemLocation/>
                <WebsiteTitleInput/>
                <TitleInput/>
            </div>
            <div className={styles["essentials-titles-2"]}>
                <div>Channel Prices</div>
                <div>eBay:</div>
                <div>Amazon:</div>
                <div>Quay Sports:</div>
                <div>Shop:</div>
            </div>
            <div className={styles["essentials-inputs-2"]}>
                <div/>
                <div>£{item.EBAYPRICEINCVAT}</div>
                <div>£{item.AMZPRICEINCVAT}</div>
                <div>£{item.QSPRICEINCVAT}</div>
                <div>£{item.SHOPPRICEINCVAT}</div>
            </div>
        </div>
    )
}