import styles from "./margin-calculator.module.css";
import {
    incrementThreshold,
    MarginItem, selectMaxThreshold,
    selectRenderedItems,
    selectTableToggles, selectThreshold
} from "../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";
import useIntersectObserver from "../../components/hooks/use-intersection-observer";
import {useEffect, useRef} from "react";

export default function InfoTable(){

    const dispatch = useDispatch()
    const items = useSelector(selectRenderedItems)
    const maxThreshold = useSelector(selectMaxThreshold)
    const threshold = useSelector(selectThreshold)
    const observableList = useRef<HTMLDivElement>(null)
    const intersectionElement = useRef<HTMLDivElement | null>(null)

    const scrollHandler = ()=> dispatch(incrementThreshold())
    useIntersectObserver(intersectionElement, observableList, threshold, maxThreshold, items, scrollHandler)

    useEffect(()=>{
        intersectionElement.current = document!.getElementById("column-layout") as HTMLDivElement
    },[])

    const toggles = useSelector(selectTableToggles)
    if(!toggles.InfoTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>Info</div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let item of items) elements.push(<InfoRow key={item.SKU} item={item}/>)

        return elements
    }



    return <div ref={observableList} className={styles["sub-table"]}>
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
        <span>{item.SKU}</span>
    </div>
}