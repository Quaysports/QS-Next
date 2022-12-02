import styles from "./test-styles.module.css"
import {MarginItem} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import SettingsTable from "./settings-table";
import PricesTable from "./prices-table";
import ResultsTable from "./results-table";

export interface UpdateHandler {
    item:MarginItem
    handler: (id: keyof MarginItem, value: number | boolean | string) => void
}

export default function MarginItemTest({initialItem = {}}:{initialItem?:MarginItem | {} }) {

    let [item, setItem] = useState<MarginItem>({...itemTemplate(), ...initialItem})

    if(!item) return null

    async function updateHandler(id: keyof MarginItem, value: number | boolean | string) {

        let newItem = {...item, ...{[id]: value}} as MarginItem

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
        IDBEP: {
            TAGS: "",
            AMAZSPORT: "",
            AMZDEPARTMENT: "",
            AMZLATENCY: 0,
            BRAND: "",
            BULLETPOINT1: "",
            BULLETPOINT2: "",
            BULLETPOINT3: "",
            BULLETPOINT4: "",
            BULLETPOINT5: "",
            CATEGORIE1: "",
            CATEGORIE2: "",
            COMISO2: "",
            COMISO3: "",
            QSCAT1: "",
            QSCAT2: "",
            SEARCHTERM1: "",
            SEARCHTERM2: "",
            SEARCHTERM3: "",
            SEARCHTERM4: "",
            SEARCHTERM5: "",
            TARIFFCODE: "",
            TRADEPACK: ""
        },
        IDBFILTER: "",
        LINNID: "",
        MARGINNOTE: "",
        MCOVERRIDES: {},
        MD: {
            AMAZONFEES: 0,
            AMAZPAVC: 0,
            AMAZPROFITLY: 0,
            AMAZSALESVAT: 0,
            EBAYFEES: 0,
            EBAYPROFITLY: 0,
            EBAYUKPAVC: 0,
            EBAYUKSALESVAT: 0,
            PACKAGING: 0,
            POSTALPRICEUK: 0,
            PRIMEPAVC: 0,
            PRIMEPOSTAGEUK: 0,
            QSFEES: 0,
            QSPAVC: 0,
            QSPROFITLY: 0,
            QSUKSALESVAT: 0,
            SHOPFEES: 0,
            SHOPPAVC: 0,
            SHOPUKSALESVAT: 0,
            TOTALPROFITLY: 0
        },
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