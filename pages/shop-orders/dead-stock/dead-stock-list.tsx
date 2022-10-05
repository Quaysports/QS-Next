import {DeadStockReport} from "../../../server-modules/shop/shop";
import Image from "next/image";
import styles from "../shop-orders.module.css";
import * as React from "react";
import {useSelector} from "react-redux";
import {selectDeadStock} from "../../../store/shop-orders-slice";

interface Props {
    supplier:string
}
export default function DeadStockList({supplier}:Props) {

    const deadStockList = useSelector(selectDeadStock)

    function imageCheck(item:DeadStockReport){
        switch (item.SOLDFLAG) {
            case 3:
                return (<Image src="/dead-stock-icon-green.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)

            case 6:
                return (<Image src="/dead-stock-icon-orange.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)

            case 10:
                return (<Image src="/dead-stock-icon-red.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)
        }
    }

    let tempArray = []
    tempArray.push(
        <div className={`${styles["shop-orders-table"]} ${styles["dead-stock-list-grid"]}`}>
            <span/>
            <span>SKU</span>
            <span>Title</span>
            <span/>
        </div>
    )
    deadStockList?.[supplier]?.forEach((value, key) => {
        tempArray.push(<div key={key} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["dead-stock-list-grid"]}`}>
            <span/>
            <span>{value.SKU}</span>
            <span>{value.TITLE}</span>
            <span>{imageCheck(value)}</span>
        </div>)
    })
    return (
        <div className={styles["shop-orders-table-containers"]}>{tempArray}</div>
    )
}