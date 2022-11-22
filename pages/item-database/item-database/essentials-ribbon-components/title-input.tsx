import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItem, setItemTitle} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css";

export default function titleInput() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function titleHandler(title: string){
        dispatch(setItemTitle(title))
    }

    return <input className={styles["title-inputs"]} value={item?.TITLE} onChange={(e) => titleHandler(e.target.value)}/>
}