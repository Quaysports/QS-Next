import styles from "./test-styles.module.css"
import {MarginItem} from "../../../store/margin-calculator-slice";
import {useEffect, useState} from "react";
import SettingsTable from "./settings-table";
import PricesTable from "./prices-table";
import ResultsTable from "./results-table";

export interface UpdateHandler {
    item:MarginItem
    handler: (id: keyof MarginItem, value: number | boolean | string) => void
}

export default function MarginItemTest({initialItem = {}}:{initialItem?:MarginItem | {}}) {

    let [item, setItem] = useState<MarginItem>({...itemTemplate(), ...initialItem})

    useEffect(() => console.log(item), [item])

    async function updateHandler(id: keyof MarginItem, value: number | boolean | string) {
        let newItem = {...item, ...{[id]: value}} as MarginItem
        console.log(newItem)
        let opts = {method:"POST", headers:{"Content-Type": "application/json"}, body:JSON.stringify(newItem)}
        let result = await fetch("/api/margin/test-item", opts)
        setItem(await result.json())
    }

    return <div className={styles.table}>
        <div className={`${styles["sub-table"]} ${styles.settings}`}>
            <div className={styles["table-heading"]}>Settings</div>
            <div className={styles["sub-table-content"]}>
                <SettingsTable handler={updateHandler} item={item}/>
            </div>
        </div>
        <div className={`${styles["sub-table"]} ${styles.prices}`}>
            <div className={styles["table-heading"]}>Prices</div>
            <div className={styles["sub-table-content"]}>
                <PricesTable handler={updateHandler} item={item}/>
            </div>
        </div>
        <div className={`${styles["sub-table"]} ${styles.results}`}>
            <div className={styles["table-heading"]}>Results</div>
            <div className={styles["sub-table-content"]}>
                <ResultsTable item={item}/>
            </div>
        </div>
    </div>
}

function itemTemplate():MarginItem{
    return {
        AMZPRIME: false,
        CD: {},
        CP: {},
        HIDE: false,
        IDBEP: {},
        IDBFILTER: "",
        LINNID: "",
        MARGINNOTE: "",
        MCOVERRIDES: {},
        MD: {},
        QSDISCOUNT: 0,
        RETAILPRICE: 0,
        SHOPDISCOUNT: 0,
        SKU: "",
        STOCKTOTAL: 0,
        STOCKVAL: 0,
        TITLE: "",
        POSTID: "82957a90-fcd3-4a57-8957-647a2380cacb",
        AMZPRICEINCVAT: "0",
        DISCOUNT: "0",
        EBAYPRICEINCVAT: "0",
        PACKGROUP: "00000000-0000-0000-0000-000000000000",
        POSTMODID: 0,
        PURCHASEPRICE: 0,
        QSPRICEINCVAT: "0",
        SHOPPRICEINCVAT: "0"
    }
}