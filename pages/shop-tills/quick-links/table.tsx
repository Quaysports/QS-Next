import styles from '../shop-tills.module.css'
import QuickLinkButton from "./quick-link-table-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkTableAddButton from "./quick-link-table-add-button";

export default function QuickLinksTable({id}){

    const links = useSelector(selectQuickLinks)

    const buildTable = (id, links)=>{
        const buttons = []
        if(!links || !links[id]) return null
        for(let index in links[id].links){
            if(links[id].links[index].SKU){
            buttons.push(<QuickLinkButton key={index} listIndex = {id} itemIndex={index} item={links[id].links[index]}/>)
            } else {
                buttons.push(<QuickLinkTableAddButton id={id} index={index}/>)
            }
        }
        return buttons
    }

    return(
        <>
            <div className={styles.table}>
                <div>
                    {buildTable(id, links)}
                </div>
            </div>
        </>
    )
}