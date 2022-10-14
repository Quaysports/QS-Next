import {DeadStockReport} from "../../../server-modules/shop/shop";
import Image from "next/image";
import styles from "../shop-orders.module.css";
import {useSelector} from "react-redux";
import {selectDeadStock} from "../../../store/shop-orders-slice";
import {useRouter} from "next/router";

export default function DeadStockList() {

    const deadStockList = useSelector(selectDeadStock)
    const router = useRouter()

    if (!router.query.index) return null

    function imageCheck(item: DeadStockReport) {
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

    Object.values(deadStockList[Number(router.query.index)]).forEach((value, key) => {
        for (let i = 0; i < value.length; i++) {
            tempArray.push(<div key={key}
                                className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["dead-stock-list-grid"]}`}>
                <span/>
                <span>{value[i].SKU}</span>
                <span>{value[i].TITLE}</span>
                <span>{imageCheck(value[i])}</span>
            </div>)
        }
    })

    return (
        <div className={styles["shop-orders-table-containers"]}>{tempArray}</div>
    )

}