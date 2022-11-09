import styles from "./margin-calculator.module.css";
import {useSelector} from "react-redux";
import {
    MarginItem, selectPackaging, selectPostage,
    selectRenderedItems,
    selectTableToggles, selectTotalStockValData
} from "../../store/margin-calculator-slice";

export default function CostsTable() {

    const items = useSelector(selectRenderedItems)

    const toggles = useSelector(selectTableToggles)
    if(!toggles.CostsTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Costs</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items)elements.push(<CostsRow key={item.SKU} item={item}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>;
}

function TitleRow(){
    const totalStockVal = useSelector(selectTotalStockValData)
    return <div className={`${styles.title} ${styles.row} ${styles["costs-grid"]}`}>
        <div>Pur Price</div>
        <div>Profit LY</div>
        <div>{totalStockVal}</div>
        <div>Packaging</div>
        <div>Pack Cost</div>
        <div>Postage</div>
        <div>Mod</div>
        <div>Cost</div>
    </div>
}

function CostsRow({item}:{item:MarginItem}){
    const packaging = useSelector(selectPackaging)
    const postage = useSelector(selectPostage)

    function postOptions(){
        let opts = []
        for(let option of Object.values(postage!)){
            opts.push(<option value={option.POSTID}>{option.SFORMAT}</option>)
        }
        return opts
    }

    function postModifierOptions(){
        let opts = []
        let mods = ['x2', 'x3', -3, -2, -1, -0.5, -0.25, -0.10, 0, 0.10, 0.25, 0.5, 1, 2, 3];
        for(let option of mods){
            opts.push(<option value={option}>{option}</option>)
        }
        return opts
    }

    return <div key={item.SKU} className={`${styles.row} ${styles["costs-grid"]}`}>
        <div>£{item.PURCHASEPRICE.toFixed(2)}</div>
        <div>{item.MD?.TOTALPROFITLY ? `£${item.MD.TOTALPROFITLY?.toFixed(2)}` :""}</div>
        <div>{item.STOCKVAL ? `£${item.STOCKVAL.toFixed(2)}` :""}</div>
        <span>{packaging ? packaging[item.PACKGROUP].NAME : ""}</span>
        <div>{packaging ? `£${packaging[item.PACKGROUP].PRICE?.toFixed(2)}` : ""}</div>
        <div><select value={item.POSTID}>{postOptions()}</select></div>
        <div><select value={item.POSTMODID}>{postModifierOptions()}</select></div>
        <div>{
            item.MD.POSTALPRICEUK ? `£${item.MD.POSTALPRICEUK.toFixed(2)}` : `£${(0).toFixed(2)}`
        }</div>
    </div>
}