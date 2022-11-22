import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems, selectSearchData,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {generateMarginText} from "../../../components/margin-calculator-utils/margin-styler";
import CSVButton from "../../../components/csv-button";

export default function MagentoTable() {

    const items = useSelector(selectRenderedItems)
    const itemsForCSV = useSelector(selectSearchData)
    const toggles = useSelector(selectTableToggles)

    function CSVData(){
        return itemsForCSV.reduce((arr:any[], item)=>{
            arr.push({
                SKU:item.SKU,
                TITLE:item.TITLE,
                PRICE:item.QSPRICEINCVAT,
                DISCOUNT:item.SHOPDISCOUNT ? item.SHOPDISCOUNT : "0",
                MARGIN:generateMarginText(item.PURCHASEPRICE, item.MD.QSPAVC ),
                NOTE:item.MARGINNOTE ? item.MARGINNOTE : ""})
            return arr
        },[])
    }

    if (!items || items.length === 0) return null

    if (!toggles.MagentoTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Magento"}/>
                <div>
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