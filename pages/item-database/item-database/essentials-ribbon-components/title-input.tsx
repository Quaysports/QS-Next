import {useDispatch, useSelector} from "react-redux";
import {dataBaseSave, selectItem, setItemTitle} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css";

export default function TitleInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function titleHandler(title: string) {
        dispatch(setItemTitle(title))
    }

    function saveItem() {
        dispatch(dataBaseSave())
    }

    return (
        <div>
            <input className={styles["title-inputs"]} value={item.title}
                   onBlur={(e) => saveItem()}
            onChange={(e) => titleHandler(e.target.value)}/>
        </div>
    )
}