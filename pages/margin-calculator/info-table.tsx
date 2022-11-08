import styles from "./margin-calculator.module.css";
import {MarginItem, selectMarginData, selectTableToggles} from "../../store/margin-calculator-slice";
import {useSelector} from "react-redux";

export default function InfoTable(){

    const items = useSelector(selectMarginData)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.InfoTable) return null

    function createTable(){
        const elements = [<TitleRow key={"title-row"}/>]

        for(let item of items) elements.push(<InfoRow key={item.SKU} item={item}/>)

        return elements
    }


    return <div className={`${styles.row} ${styles["sub-table"]}`}>
        {createTable()}
    </div>
}

function TitleRow(){
    return <div className={`${styles.title} ${styles.row} ${styles["info-grid"]}`}>
        <div>Fn</div>
        <div>Hi</div>
        <div>SKU</div>
    </div>
}

function InfoRow({item}:{item:MarginItem}){
    return <div key={item.SKU} className={`${styles.row} ${styles["info-grid"]}`}>
        <div></div>
        <div><input type={"checkbox"} defaultChecked={item.HIDE}/></div>
        <div>{item.SKU}</div>
    </div>
}