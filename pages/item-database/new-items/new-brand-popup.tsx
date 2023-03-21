import {useState} from "react";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {dispatchToast} from "../../../components/toast/dispatch-toast";
import {useDispatch} from "react-redux";
import {addNewBrandToList} from "../../../store/item-database/new-items-slice"
import ErrorPopup from "./error-popup";
import styles from '../item-database.module.css'

export default function NewBrandPopup() {

    const [brandName, setBrandName] = useState<string>("")
    const [brandPrefix, setBrandPrefix] = useState<string>("")
    const dispatch = useDispatch()

    async function saveHandler(brand: string, prefix: string) {
        if (RegExp("^[a-zA-Z]{3}$").test(prefix)) {
            const opts = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({brand: brand, prefix: prefix})
            }
            dispatchNotification({type: 'loading', content: "Saving to database, please wait..."})
            const res = await fetch('/api/item-database/save-new-brand', opts)
            dispatchNotification()

            if (res.status === 400) dispatchNotification({
                type: 'alert',
                content: <ErrorPopup errors={await res.json()}/>
            })
            if (res.status === 200) {
                dispatchToast({content: await res.json()})
                dispatch(addNewBrandToList(brand))
            }
        } else {
            dispatchToast({content: 'Prefix must be A-Z and 3 characters long'})
        }
    }

    return (
        <div>
            <div className={styles['brand-popup-divs']}>
                <label htmlFor={'brand-name'}>Name: </label>
                <input id={'brand-name'} role={'brand-input'} value={brandName}
                       onChange={(e) => setBrandName(e.target.value)}/>
            </div>
            <div className={styles['brand-popup-divs']}>
                <span>Prefix: </span>
                <input role={'brand-prefix-input'} value={brandPrefix}
                       onChange={(e) => setBrandPrefix(e.target.value)}/>
            </div>
            <button className={styles['new-brand-save']} role={'save-button'} onClick={() => saveHandler(brandName, brandPrefix)}>Save</button>
        </div>
    )
}