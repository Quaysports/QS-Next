import {useDispatch, useSelector} from "react-redux";
import {
    selectItem, selectTags, setItemTags,
} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css"
import ItemLocation from "./location-selects";
import SuppliersSelect from "./supplier-select";
import BrandInput from "./brand-input";
import TitleInput from "./title-input";
import WebsiteTitleInput from "./website-title-input";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import ShippingSelect from "./shipping-select";
import {toCurrency} from "../../../../components/utils/utils";
import TagsCheckboxList from "../../../../components/item-database-utils/tags-popup";

export default function EssentialsRibbon(){

    const item = useSelector(selectItem)
    const tags = useSelector(selectTags)
    const dispatch = useDispatch()
    function tagHandler(tags:string[]){
        dispatch(setItemTags(tags))
    }
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
                <div>{item.stock.total}</div>
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
                <div/>
                <div>Tags:</div>
                <div>Shipping Format:</div>
            </div>
            <div className={styles["essentials-inputs-2"]}>
                <div/>
                <div>{toCurrency(item.prices.ebay)}</div>
                <div>{toCurrency(item.prices.amazon)}</div>
                <div>{toCurrency(item.prices.magento)}</div>
                <div>{toCurrency(item.prices.shop)}</div>
                <div/>
                <div className={`${styles["tags-button"]} button`} onClick={() => {
                    dispatchNotification(
                        {
                            type:"popup",
                            content:<TagsCheckboxList tags={tags} handler={(x) => tagHandler(x)} itemTags={item.tags}/>,
                            title:"Tags"
                        }
                    )}}>{item.tags ? item.tags.length : 0} Tags</div>
                <div><ShippingSelect/></div>
            </div>
        </div>
    )
}