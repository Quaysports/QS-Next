import {useDispatch, useSelector} from "react-redux";
import {dataBaseSave, selectItem, setItemWebsiteTitle} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css"

export default function WebsiteTitleInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function websiteTitleHandler(websiteTitle: string) {
        dispatch(setItemWebsiteTitle(websiteTitle))
    }

    function saveItem() {
        dispatch(dataBaseSave())
    }

    return (
        <div>
            <input className={styles["title-inputs"]} value={item.webTitle}
                   onChange={(e) => {websiteTitleHandler(e.target.value)}}
                   onBlur={() => {saveItem()}}/>
        </div>
    )
}