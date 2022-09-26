import styles from '../shop-tills.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import DatabaseSearchBar, {searchResult} from "../../../components/database-search-bar/DatabaseSearch";

export default function QuickLinkTableAddButton(){
    const handler = (res:searchResult[])=>{
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