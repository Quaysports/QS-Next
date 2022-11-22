import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    selectRenderedItems, selectSearchData,
    selectTableToggles,
} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import ItemRow from "./item-row";
import TitleRow from "./title-row";
import TitleLink from "../title-link";
import CSVButton from "../../../components/csv-button";
import {generateMarginText} from "../../../components/margin-calculator-utils/margin-styler";

export default function EbayTable() {

    const items = useSelector(selectRenderedItems)
    const itemsForCSV = useSelector(selectSearchData)
    const toggles = useSelector(selectTableToggles)
    const [toggleMarginTest, setToggleTest] = useState<boolean>(false)

    function CSVData(){
        return itemsForCSV.reduce((arr:any[], item)=>{
            arr.push({
                SKU:item.SKU,
                TITLE:item.TITLE,
                PRICE:item.EBAYPRICEINCVAT,
                MARGIN:generateMarginText(item.PURCHASEPRICE, item.MD.EBAYUKPAVC ),
                NOTE:item.MARGINNOTE ? item.MARGINNOTE : ""})
            return arr
        },[])
    }

    if(!items || items.length === 0) return null

    if (!toggles.EbayTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <div>
                    <TitleLink type={"Ebay"}/>
                </div>
                <div className={styles["header-buttons"]}>
                    <CSVButton fileName={`Magento CSV - ${Date.now()}`}
                               label={"CSV"}
                               objectArray={CSVData()}/>
                    <button onClick={() => setToggleTest(!toggleMarginTest)}>Margin Tests</button>
                </div>
            </div>,
            <TitleRow key={"title-row"} test={toggleMarginTest}/>
        ]

        for(let index in items) elements.push(
            <ItemRow key={items[index].SKU}
                     item={items[index]}
                     displayTest={toggleMarginTest}
                     index={index}/>
        )

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}