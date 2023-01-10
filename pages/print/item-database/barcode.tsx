import {useEffect, useState} from "react";
import Barcode from 'react-barcode'
import styles from "./css/barcode.module.css"

export default function CreateBarcode() {

    const [item, setItem] = useState<schema.Item | null>(null)

    useEffect(() => {
        const data = window.localStorage.getItem("item")
        data ? setItem(JSON.parse(data)) : null
    }, [])

    useEffect(() => {
        if (item) window.print()
    }, [item])

    if(!item) return null

    return (
        <div className={styles["container"]}>
            <style>{`
                    @page {
        background-color: white;
        size: 1.5in 1in;
        font-size: 0.8em;
        margin: 0;
    }`}</style>
            <Barcode value={item.EAN!} width={1} height={50} textPosition={"top"} fontSize={10} marginBottom={2} background={"white"}/>
            <div className={styles["sku"]}>{item.SKU}</div>
        </div>
    )
}
