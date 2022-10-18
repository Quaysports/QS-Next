import {useDispatch, useSelector} from "react-redux";
import {
    selectBrands,
    selectCurrentSupplier,
    selectItem,
    selectSuppliers,
    setBrands,
    setCurrentSupplier
} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import {useEffect} from "react";

/**
 * Essentials Ribbon Component
 */

export default function EssentialsRibbon(){

    const item = useSelector(selectItem)
    const suppliers = useSelector(selectSuppliers)
    const currentSupplier = useSelector(selectCurrentSupplier)
    const brands = useSelector(selectBrands)
    const dispatch = useDispatch()

    useEffect(() => {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body:JSON.stringify(currentSupplier)
    }
        fetch("/api/item-database/get-supplier-brands", opts)
            .then(res => res.json())
            .then(res => {
                dispatch(setBrands(res))
            })
    }, [currentSupplier])

    function prefixOptions(){
        return [<>
            <option/>
            <option>R</option>
            <option>S</option>
        </>]
    }

    function letterOptions(){
        let alphabetArray = [<option/>]
        for(let i = 0; i < 26; i++){
            alphabetArray.push(<option>{String.fromCharCode((65+i))}</option>)
        }
        return alphabetArray
    }

    function numberOptions(){
        let numberArray = [<option/>]
        for(let i = 0; i < 100; i++){
            numberArray.push(<option>{i}</option>)
        }
        return numberArray
    }

    function supplierOptions(){
        let supplierArray = [<option/>]
        for(let i = 0; i < suppliers?.length; i++){
            supplierArray.push(
                <option>{suppliers[i]}</option>
            )
        }
        return supplierArray
    }

    function brandOptions(){
        if(brands?.length > 0) {
            let brandArray = [<option/>]
            for (let i = 0; i < brands.length; i++) {
                brandArray.push(
                    <option>{brands[i]}</option>
                )
            }
            return brandArray
        } else {
            return [<option>No associated brands</option>]
        }
    }

    return(
        <div className={styles["item-details-essentials"]}>
            <div className={styles["essentials-titles-1"]}>
                <div>Brand:</div>
                <div>SKU:</div>
                <div>EAN:</div>
                <div>Supplier:</div>
                <div>Stock Total:</div>
                <div>Location:</div>
                <div>Website Title:</div>
                <div>Linnworks Title:</div>
            </div>
            <div className={styles["essentials-inputs-1"]}>
                <div><select value={item?.IDBEP?.BRAND}>{brandOptions()}</select></div>
                <div>{item?.SKU}</div>
                <div>{item?.EAN}</div>
                <div><select value={item?.SUPPLIER} onChange={(e) => dispatch(setCurrentSupplier(e.target.value))}>{supplierOptions()}</select></div>
                <div>{item?.STOCKTOTAL}</div>
                <div><select>{prefixOptions()}</select><select>{letterOptions()}</select><select>{numberOptions()}</select></div>
                <div><input style={{width:"100%"}} defaultValue={item?.TITLEWEBSITE}/></div>
                <div><input style={{width:"100%"}} defaultValue={item?.TITLE}/></div>
            </div>
            <div className={styles["essentials-titles-2"]}>
                <div>Channel Prices</div>
                <div>eBay:</div>
                <div>Amazon:</div>
                <div>Quay Sports:</div>
                <div>Shop:</div>
            </div>
            <div className={styles["essentials-inputs-2"]}>
                <div/>
                <div>£{item?.EBAYPRICEINCVAT}</div>
                <div>£{item?.AMZPRICEINCVAT}</div>
                <div>£{item?.QSPRICEINCVAT}</div>
                <div>£{item?.SHOPPRICEINCVAT}</div>
            </div>
        </div>
    )
}