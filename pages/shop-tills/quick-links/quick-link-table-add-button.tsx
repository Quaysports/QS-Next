import styles from './quick-links.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import DatabaseSearchBar, {DatabaseSearchItem} from "../../../components/database-search-bar/database-search";
import {addItemToLinks} from "../../../store/shop-tills/quicklinks-slice";
import {useDispatch} from "react-redux";

interface Props {
    id:number;
    index:number;
}

export default function QuickLinkTableAddButton({id, index}:Props){

    const dispatch = useDispatch()
    const handler = (res:DatabaseSearchItem)=>{
        dispatchNotification({type:undefined})
        dispatch(addItemToLinks({id:id, index:index, data:{SKU: res.SKU, SHOPPRICEINCVAT: "0", TITLE: res.TITLE}}))
        console.log("handled!")
        console.log(res)
    }
    return(
        <>
            <div className={styles["table-add-button"]} onClick={()=>dispatchNotification({
                type:"popup",
                title:"Item Search",
                content:<DatabaseSearchBar handler={handler}/>
            })}><div>+</div></div>
        </>
    )
}