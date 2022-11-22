import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemWebsiteTitle} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css"

export default function websiteTitleInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function websiteTitleHandler(websiteTitle:string) {
        dispatch(setItemWebsiteTitle(websiteTitle))
    }

    return <input className={styles["title-inputs"]} value={item?.TITLEWEBSITE} onChange={(e) => {websiteTitleHandler(e.target.value)}}/>
}