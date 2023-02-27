import styles from "./utils.module.css";
import Image from "next/image";
import {toCurrency} from "./utils";

export default function ComparisonTrendStyle({amount, inverse = false}: { amount: number, inverse?: boolean }) {

    `/trend-down-${inverse ? "green" : "red"}.svg`

    if(amount >= 0){

        const upArrow = `/trend-up-${inverse ? "red" : "green"}.svg`
        const color = `var(--traffic-light-${inverse ? "red" : "green"})`

        return <div className={styles.trend}>
            <Image alt={""} src={upArrow} width={20} height={20}/>
            <div style={{color: color}}>{toCurrency(amount)}</div>
        </div>
    }

    const downArrow = `/trend-down-${inverse ? "green" : "red"}.svg`
    const color = `var(--traffic-light-${inverse ? "green" : "red"})`

    return <div className={styles.trend}>
        <Image alt={""} src={downArrow} width={20} height={20}/>
        <div style={{color:color}}>{toCurrency(amount)}</div>
    </div>
}