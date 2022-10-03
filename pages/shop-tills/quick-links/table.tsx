import styles from '../shop-tills.module.css'
import QuickLinkButton from "./quick-link-table-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkTableAddButton from "./quick-link-table-add-button";
import ColumnLayout from "../../../components/layouts/column-layout";
import {QuickLinks} from "../../../server-modules/shop/shop";

interface Props {
    id:number;
}

export default function QuickLinksTable({id}:Props){

    const links = useSelector(selectQuickLinks)

    const buildTable = (id:number, links:QuickLinks[])=>{
        const buttons = []
        if(!links || !links[id]) return null
        for(let index in links[id].links){
            if(links[id].links[index].SKU){
            buttons.push(<QuickLinkButton key={index} listIndex = {id} itemIndex={Number(index)} item={links[id].links[index]}/>)
            } else {
                buttons.push(<QuickLinkTableAddButton key={index} id={id} index={Number(index)}/>)
            }
        }
        return buttons
    }

    return(
        <>
            <ColumnLayout scroll={true}>
                <div className={styles.table}>{buildTable(id, links)}</div>
            </ColumnLayout>
        </>
    )
}