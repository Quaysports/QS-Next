import styles from '../shop-tills.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import DatabaseSearchBar, {searchResult} from "../../../components/database-search-bar/DatabaseSearch";
import {addItemToLinks} from "../../../store/shop-tills/quicklinks-slice";
import {useDispatch} from "react-redux";

export default function QuickLinkTableAddButton({id, index}){

    const dispatch = useDispatch()
    const handler = (res:searchResult)=>{
        dispatchNotification({type:null})
        dispatch(addItemToLinks({id:id, index:index, data:{SKU: res.SKU, SHOPPRICEINCVAT: 0, TITLE: res.TITLE}}))
        console.log("handled!")
        console.log(res)
    }
    return(
        <>
            <div className={styles["quick-link-table-add-button"]} onClick={()=>dispatchNotification({
                type:"popup",
                title:"Item Search",
                content:<DatabaseSearchBar handler={handler}/>
            })}><div>+</div></div>
        </>
    )
}