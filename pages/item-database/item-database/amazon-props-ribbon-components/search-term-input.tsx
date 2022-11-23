import styles from "../../item-database.module.css";
import {useDispatch} from "react-redux";
import {setItemSearchTerms} from "../../../../store/item-database/item-database-slice";

interface Props{
    index: number
}
export default function SearchTermInput({index}:Props) {

    const dispatch = useDispatch()

    function searchTermsHandler(value: string, index:number){
        dispatch(setItemSearchTerms({value:value, index:index}))
    }

    return (
        <span className={styles["search-term"]}>
            <span>{index}:</span>
            <input onChange={(e) => {searchTermsHandler(e.target.value, index)}}/>
        </span>
    )
}