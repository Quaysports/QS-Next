import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemTitle} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css";

export default function TitleInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function titleHandler(title: string) {
        dispatch(setItemTitle(title))
    }

    return (
        <div>
            <input className={styles["title-inputs"]} defaultValue={item.title || ""}
                   onBlur={(e) => titleHandler(e.target.value)}/>
        </div>
    )
}