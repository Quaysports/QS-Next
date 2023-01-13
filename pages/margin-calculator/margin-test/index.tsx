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

export interface MarginTestTemplate extends Pick<MarginItem, "postage" | "packaging" | "prices" | "marginData">{
    discount:number
}

export default function MarginItemTest({initialItem = undefined}:{initialItem?:MarginItem | undefined }) {

    let [item, setItem] = useState<MarginTestTemplate>(initialItem ? {...initialItem, discount:0} : itemTemplate())

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
        packaging: {editable: false, group: "", items: [], lock: false},
        postage: {id: "", modifier: "", price: 0},
        prices: {amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0, shop: 0},
        marginData: {
            amazonFees: 0,
            amazonPrimePostageCost: 0,
            amazonPrimeProfitAfterVat: 0,
            amazonProfitAfterVat: 0,
            amazonProfitLastYear: 0,
            amazonSalesVat: 0,
            ebayFees: 0,
            ebayProfitAfterVat: 0,
            ebayProfitLastYear: 0,
            ebaySalesVat: 0,
            magentoFees: 0,
            magentoProfitAfterVat: 0,
            magentoProfitLastYear: 0,
            magentoSalesVat: 0,
            packagingCost: 0,
            postageCost: 0,
            shopFees: 0,
            shopProfitAfterVat: 0,
            shopProfitLastYear: 0,
            shopSalesVat: 0,
            totalProfitLastYear: 0
        },
        discount: 0
    }
}