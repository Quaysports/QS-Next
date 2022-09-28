import styles from './shop-stock-take.module.css'

interface props {
    item?: { _id: string, SKU: string, EAN:string, TITLE: string, STOCKTOTAL: number } | null;
}

export default function ShopStockTakeRow({item = null}: props) {
    return (
        <>
            {!item ?
                <div className={styles.title}>
                    <div>SKU</div>
                    <div>EAN</div>
                    <div>Title</div>
                    <div>Stock</div>
                    <div className={styles.center}>Update</div>
                    <div className={styles.center}>Checked</div>
                </div>
                : <div className={styles.row}>
                    <div>{item.SKU}</div>
                    <div>{item.EAN}</div>
                    <div>{item.TITLE}</div>
                    <div>{item.STOCKTOTAL}</div>
                    <div><input/></div>
                    <div><input type={"checkbox"}/></div>
                </div>}
        </>
    )
}