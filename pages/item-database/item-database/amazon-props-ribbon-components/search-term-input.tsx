import styles from "../../item-database.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemSearchTerms} from "../../../../store/item-database/item-database-slice";

interface Props{
    index: number
}
export default function SearchTermInput({index}:Props) {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    let searchTerm = "searchTerm" + index as keyof schema.MappedExtendedProperties

    function searchTermsHandler(value: string, index:number){
        dispatch(setItemSearchTerms({value:value, index:index}))
    }

    return (
        <span className={styles["search-term"]}>
            <span>{index}:</span>
            <input onBlur={(e) => {searchTermsHandler(e.target.value, index)}} defaultValue={item.mappedExtendedProperties[searchTerm] ?  item.mappedExtendedProperties[searchTerm] : ""}/>
        </span>
    )
}