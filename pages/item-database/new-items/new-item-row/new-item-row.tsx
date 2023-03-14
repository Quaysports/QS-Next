import BrandSelect from "./brand-select";
import SKUInput from "./sku-input";
import TitleInput from "./title-input";
import RetailPriceInput from "./retail-price-input";
import BarcodeInput from "./barcode-input";
import ShippingSelect from "./shipping-select";
import QuantityInput from "./quantity-input";
import TagsPopup from "./tags-popup";
import PurchasePriceInput from "./purchase-price-input";
import DeleteButton from "./delete-button";
import styles from '../../item-database.module.css'

type Props = {
    index:number
    deleteRow: () => void
}
export default function NewItemRow({index, deleteRow}: Props){
    return (
        <div className={styles['new-item-row']}>
            <BrandSelect index={index}/>
            <SKUInput index={index}/>
            <TitleInput index={index}/>
            <PurchasePriceInput index={index}/>
            <RetailPriceInput index={index}/>
            <BarcodeInput index={index}/>
            <QuantityInput index={index}/>
            <ShippingSelect index={index}/>
            <TagsPopup index={index}/>
            <div/>
            <DeleteButton deleteRow={() => deleteRow()}/>
        </div>
    )
}