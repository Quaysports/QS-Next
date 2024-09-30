import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectRenderedItems, selectSearchData} from "../../../store/margin-calculator-slice";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {generateMarginText} from "../../../components/margin-calculator-utils/margin-styler";
import CSVButton from "../../../components/csv-button";
import {selectMarginSettings} from "../../../store/session-slice";


export default function MagentoTable() {

    const items = useSelector(selectRenderedItems)
    const itemsForCSV = useSelector(selectSearchData)
    const settings = useSelector(selectMarginSettings)

    function CSVData(){
        return itemsForCSV.reduce((arr:any[], item)=>{
            arr.push({
                SKU:item.SKU,
                TITLE:item.title,
                PRICE:item.prices.magento,
                DISCOUNT:item.discounts.magento,
                MARGIN:generateMarginText(item.prices.purchase, item.marginData.magento.profit ),
                NOTE:item.marginNote})
            return arr
        },[])
    }

    if (!items || items.length === 0) return null

    if (!settings?.tables.MagentoTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <div><TitleLink type={"Magento"}/></div>
                <div className={styles["header-buttons"]}>
                    <CSVButton fileName={`Magento CSV - ${Date.now()}`}
                               objectArray={CSVData()}
                               label={"CSV"}/>
                </div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for (let index in items) elements.push(<ItemRow key={items[index].SKU}
                                                        item={items[index]}
                                                        index={index}/>)
        
        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}