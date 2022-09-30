import {useDispatch, useSelector} from "react-redux";
import {
    selectBrands,
    selectCurrentSupplier,
    selectItem,
    selectSuppliers,
    setBrands, setCurrentSupplier
} from "../../../store/item-database/item-database-slice";
import styles from "../item-database.module.css"
import {useEffect} from "react";


export default function EssentialsRibbon(){

    const item = useSelector(selectItem)
    const suppliers = useSelector(selectSuppliers)
    const currentSupplier = useSelector(selectCurrentSupplier)
    const brands = useSelector(selectBrands)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch("/api/item-database/get-supplier-brands")
            .then(res => res.json())
            .then(res => {
                dispatch(setBrands(res))
            })
    }, [currentSupplier])

    function letterOptions(){
        let alphabetArray = [<option/>]
        for(let i = 0; i < 26; i++){
            alphabetArray.push(<option>{String.fromCharCode((65+i))}</option>)
        }
        return alphabetArray
    }

    function numberOptions(){
        let numberArray = [<option/>]
        for(let i = 0; i < 99; i++){
            numberArray.push(<option>{i}</option>)
        }
        return numberArray
    }

    function supplierOptions(){
        let supplierArray = [<option/>]
        for(let i = 0; i < suppliers?.length; i++){
            supplierArray.push(
                <option onClick={() => dispatch(setCurrentSupplier(suppliers[i]))}>{suppliers[i]}</option>
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
            <span className={styles["essentials-titles"]}>
                <div>Brand:</div>
                <div>SKU:</div>
                <div>EAN:</div>
                <div>Supplier:</div>
                <div>Stock Total:</div>
                <div>Location:</div>
                <div>Website Title:</div>
                <div>Linnworks Title:</div>
            </span>
            <span className={styles["essentials-inputs"]}>
                <div><select defaultValue={item?.IDBEP?.BRAND ? item.IDBEP.BRAND: null}>{brandOptions()}</select></div>
                <div>{item?.SKU}</div>
                <div>{item?.EAN}</div>
                <div><select value={item?.SUPPLIER ? item.SUPPLIER: null}>{supplierOptions()}</select></div>
                <div>{item?.STOCKTOTAL}</div>
                <div><select>{letterOptions()}</select><select>{numberOptions()}</select></div>
                <div><input/></div>
                <div><input/></div>
            </span>
            <span className={styles["essentials-titles"]}>
                <div>Channel Prices</div>
                <div>eBay:</div>
                <div>Amazon:</div>
                <div>Quay Sports:</div>
                <div>Shop:</div>
            </span>
            <span className={styles["essentials-inputs"]}>
                <div/>
                <div>{item?.EBAYPRICEINCVAT}</div>
                <div>{item?.AMZPRICEINCVAT}</div>
                <div>{item?.QSPRICEINCVAT}</div>
                <div>{item?.SHOPPRICEINCVAT}</div>
            </span>
        </div>
    )
}