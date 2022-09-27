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
        for(let link of links[id].links){
            buttons.push(<QuickLinkButton key={link.SKU} sku={link.SKU} title={link.TITLE} price={"£"+link.SHOPPRICEINCVAT}/>)
        }
        return buttons
    }

    return(
        <>
            <div className={styles.table}>
                <div>
                    {buildTable(id, links)}
                    {links[id]?.links?.length < 20 ? <QuickLinkTableAddButton id={id}/> : null}
                </div>
            </div>
        </>
    )
}