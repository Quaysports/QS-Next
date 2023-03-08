import styles from "./utils.module.css";
import Image from "next/image";
import {toCurrency} from "./utils";

export default function ComparisonTrendStyle({amount, currency = true, inverse = false, size=20}: { amount: number, currency?:boolean, inverse?: boolean, size?:number }) {

    `/trend-down-${inverse ? "green" : "red"}.svg`

    if(amount >= 0){

        const upArrow = `/trend-up-${inverse ? "red" : "green"}.svg`
        const color = `var(--traffic-light-${inverse ? "red" : "green"})`

        return <div className={styles.trend}>
            <Image alt={""} src={upArrow} width={size} height={size}/>
            <div style={{color: color}}>{currency ? toCurrency(amount): amount}</div>
        </div>
    }

    const downArrow = `/trend-down-${inverse ? "green" : "red"}.svg`
    const color = `var(--traffic-light-${inverse ? "green" : "red"})`

    return <div className={styles.trend}>
        <Image alt={""} src={downArrow} width={size} height={size}/>
        <div style={{color:color}}>{currency ? toCurrency(amount) : amount}</div>
    </div>
}