import styles from "../margin-calculator.module.css";
import {useSelector} from "react-redux";
import {selectRenderedItems, selectSearchData} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import TitleRow from "./title-row";
import ItemRow from "./item-row"
import TitleLink from "../title-link";
import {generateMarginText} from "../../../components/margin-calculator-utils/margin-styler";
import CSVButton from "../../../components/csv-button";
import {selectMarginSettings} from "../../../store/session-slice";

export default function AmazonTable() {

    const items = useSelector(selectRenderedItems)
    const itemsForCSV = useSelector(selectSearchData)
    const settings = useSelector(selectMarginSettings)
    const [toggleMarginTest, setToggleTest] = useState<boolean>(false)

    function CSVData(){
        return itemsForCSV.reduce((arr:any[], item)=>{
            arr.push({
                SKU:item.SKU,
                TITLE:item.TITLE,
                PRICE:item.AMZPRICEINCVAT,
                MARGIN:generateMarginText(item.PURCHASEPRICE, item.MD.AMAZPAVC ),
                NOTE:item.MARGINNOTE ? item.MARGINNOTE : ""})
            return arr
        },[])
    }

    if(!items || items.length === 0) return null

    if (!settings?.tables.AmazonTable) return null

    function createTable() {
        const elements = [
            <div key={"header"} className={styles.header}>
                <div><TitleLink type={"Amazon"}/></div>
                <div className={styles["header-buttons"]}>
                    <CSVButton fileName={`Amazon CSV - ${Date.now()}`}
                               objectArray={CSVData()}
                               label={"CSV"}/>
                    <button onClick={() => setToggleTest(!toggleMarginTest)}>Margin Tests</button>
                </div>
            </div>,
            <TitleRow key={"title-row"} displayTest={toggleMarginTest}/>
        ]
        for(let index in items) elements.push(
            <ItemRow key={items[index].SKU} item={items[index]} displayTest={toggleMarginTest} index={index}/>
        )

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}