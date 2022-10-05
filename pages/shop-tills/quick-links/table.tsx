import styles from './quick-links.module.css'
import QuickLinkButton from "./quick-link-table-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkTableAddButton from "./quick-link-table-add-button";
import ColumnLayout from "../../../components/layouts/column-layout";

interface Props {
    id: number;
}

export default function QuickLinksTable({id}: Props) {

    const links = useSelector(selectQuickLinks)

    const buttons = []
    if (!links || !links[id]) return null
    for (let index in links[id].links) {
        if (links[id].links[index].SKU) {
            buttons.push(<QuickLinkButton
                key={index}
                listIndex={id}
                itemIndex={Number(index)}
                item={links[id].links[index]}/>)
        } else {
            buttons.push(<QuickLinkTableAddButton
                key={index}
                id={id}
                index={Number(index)}/>)
        }
    }

    return (
        <>
            <ColumnLayout scroll={true}>
                <div className={styles.table}>{buttons}</div>
            </ColumnLayout>
        </>
    )
}