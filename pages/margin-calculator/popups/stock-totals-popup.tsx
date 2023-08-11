import {useSelector} from "react-redux";
import {selectTotalStockValue} from "../../../store/margin-calculator-slice";
import {toCurrency} from "../../../components/utils/utils";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import CSVButton from "../../../components/csv-button";
import styles from "./popup-styles.module.css"

interface CSVData {[key: string]: string | number;}
export default function StockTotalsPopup(){
    const router = useRouter()
    const stockValue = useSelector(selectTotalStockValue)
    const tag = router.query.domestic === "true" ? "Domestic" : "International"
    const [stockValueCSVData, setStockValueCSVData] = useState<CSVData[]>([])

    useEffect(()=>{
        let opts = {
            method:"POST", headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(router.query.domestic === "true")
        }

        fetch("/api/items/get-stock-value-csv", opts).then(res=>res.json()).then((csv:CSVData[])=>{
            for(let item of csv) delete item._id
            setStockValueCSVData(csv)
        })
    },[stockValue])

    return <div className={styles["stock-value"]}>
        <div>{tag} Stock Value</div>
        <div>{toCurrency(stockValue)}</div>
        <CSVButton objectArray={stockValueCSVData} fileName={`${tag}-stock-value`}/>
    </div>
}