import styles from "./test-styles.module.css"
import {MarginItem} from "../../../store/margin-calculator-slice";
import {useState} from "react";
import SettingsTable from "./settings-table";
import PricesTable from "./prices-table";
import ResultsTable from "./results-table";

type MarginTestValueType = number | boolean | string | MarginItem["prices"] | MarginItem["packaging"] | MarginItem["postage"]
export interface UpdateHandler {
    item:MarginTestTemplate
    handler: (id: keyof MarginTestTemplate, value: MarginTestValueType) => void
}

export interface MarginTestTemplate extends Pick<MarginItem, "postage" | "packaging" | "prices" | "marginData" | "tags" | "discounts">{
    discount:number
}

export default function MarginItemTest({initialItem = undefined}:{initialItem?:MarginItem | undefined }) {

    let [item, setItem] = useState<MarginTestTemplate>(initialItem ? {...itemTemplate(), ...initialItem} : itemTemplate())

    if(!item) return null

    async function updateHandler(id: keyof MarginTestTemplate, value: MarginTestValueType) {

        let newItem = {...item, ...{[id]: value}} as MarginTestTemplate

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

function itemTemplate():MarginTestTemplate{
    return {
        tags: [],
        packaging: {editable: false, group: "", items: [], lock: false},
        postage: {id: "", modifier: "", price: 0},
        prices: {amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0, shop: 0},
        marginData: {
            amazon: {primePostage: 0, primeProfit: 0, profitLastYear: 0, fees: 0, profit: 0, salesVAT: 0},
            ebay: {profitLastYear: 0, fees: 0, profit: 0, salesVAT: 0},
            magento: {profitLastYear: 0, fees: 0, profit: 0, salesVAT: 0},
            shop: {profitLastYear: 0, fees: 0, profit: 0, salesVAT: 0},
            packaging: 0,
            postage: 0,
            totalProfitLastYear: 0
        },
        discount: 0,
        discounts: {magento: 0, shop: 0}
    }
}