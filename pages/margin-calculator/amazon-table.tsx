import styles from "./margin-calculator.module.css";
import Image from "next/image";
import {useSelector} from "react-redux";
import {
    MarginItem,
    selectRenderedItems,
    selectTableToggles
} from "../../store/margin-calculator-slice";

export default function AmazonTable() {

    const items = useSelector(selectRenderedItems)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.AmazonTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Amazon</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<AmazonRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}

function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["amazon-grid"]}`}>
        <div>Amz Price</div>
        <div>Test</div>
        <div>Result</div>
        <div>Amz Margin</div>
        <div><Image alt={"prime"} src={"/prime-logo.svg"} width={"20"} height={"20"}/></div>
        <div>Prime Margin</div>
    </div>
}

function AmazonRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["amazon-grid"]}`}>
        <div><input defaultValue={item.AMZPRICEINCVAT}/></div>
        <div></div>
        <div></div>
        <div>£{item.MD.AMAZPAVC?.toFixed(2)}</div>
        <div><input type={"checkbox"} defaultChecked={item.AMZPRIME}/></div>
        <div>{item.AMZPRIME ? "£"+item.MD.PRIMEPAVC?.toFixed(2) : ""}</div>
    </div>
}