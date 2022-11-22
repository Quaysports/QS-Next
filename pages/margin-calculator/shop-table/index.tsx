import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectRenderedItems, selectSearchData} from "../../../store/margin-calculator-slice";
import ItemRow from "./item-row";
import TitleRow from "./title-row";
import TitleLink from "../title-link";
import {generateMarginText} from "../../../components/margin-calculator-utils/margin-styler";
import CSVButton from "../../../components/csv-button";
import {selectMarginSettings} from "../../../store/session-slice";

export default function ShopTable() {

    const items = useSelector(selectRenderedItems)
    const itemsForCSV = useSelector(selectSearchData)
    const settings = useSelector(selectMarginSettings)

    function CSVData(){
        return itemsForCSV.reduce((arr:any[], item)=>{
            arr.push({
                SKU:item.SKU,
                TITLE:item.TITLE,
                PRICE:item.SHOPPRICEINCVAT,
                DISCOUNT:item.SHOPDISCOUNT ? item.SHOPDISCOUNT : "0",
                MARGIN:generateMarginText(item.PURCHASEPRICE, item.MD.SHOPPAVC ),
                NOTE:item.MARGINNOTE ? item.MARGINNOTE : ""})
            return arr
        },[])
    }

    if(!items || items.length === 0) return null

    if(!settings?.tables.ShopTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Shop"}/>
                <div>
                    <CSVButton fileName={`Shop CSV - ${Date.now()}`}
                               objectArray={CSVData()}
                               label={"CSV"}/>
                </div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let index in items) elements.push(<ItemRow key={items[index].SKU}
                                                       item={items[index]}
                                                       index={index}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}