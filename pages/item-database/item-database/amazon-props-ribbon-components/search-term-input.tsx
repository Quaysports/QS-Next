import styles from "../../item-database.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemSearchTerms} from "../../../../store/item-database/item-database-slice";

interface Props{
    index: number
}
export default function SearchTermInput({index}:Props) {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    let searchTerm = "SEARCHTERM" + index as keyof sbt.itemDatabaseExtendedProperties

    function searchTermsHandler(value: string, index:number){
        dispatch(setItemSearchTerms({value:value, index:index}))
    }

    return (
        <span className={styles["search-term"]}>
            <span>{index}:</span>
            <input onChange={(e) => {searchTermsHandler(e.target.value, index)}} value={item.IDBEP[searchTerm] ?  item.IDBEP[searchTerm] : ""}/>
        </span>
    )
}