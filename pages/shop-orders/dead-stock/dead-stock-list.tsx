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
                return (
                    <Image
                        src="/dead-stock-icon-green.webp"
                        width="22"
                        height="22"
                        alt={"dead-stock-icon"}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                );

            case 6:
                return (
                    <Image
                        src="/dead-stock-icon-orange.webp"
                        width="22"
                        height="22"
                        alt={"dead-stock-icon"}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                );

            case 10:
                return (
                    <Image
                        src="/dead-stock-icon-red.webp"
                        width="22"
                        height="22"
                        alt={"dead-stock-icon"}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                );
        }
    }

    let tempArray = []
    tempArray.push(
        <div key={"title"} className={`${styles["shop-orders-table"]} ${styles["dead-stock-list-grid"]}`}>
            <span/>
            <span>SKU</span>
            <span>Title</span>
            <span/>
        </div>
    )

    Object.values(deadStockList[Number(router.query.index)]).forEach((value) => {
        for (let i = 0; i < value.length; i++) {
            tempArray.push(<div key={value[i].SKU}
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