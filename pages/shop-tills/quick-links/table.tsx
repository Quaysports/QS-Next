import styles from './quick-links.module.css'
import QuickLinkButton from "./quick-link-table-button";
import {useSelector} from "react-redux";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import QuickLinkTableAddButton from "./quick-link-table-add-button";
import ColumnLayout from "../../../components/layouts/column-layout";
import {useRouter} from "next/router";

export default function QuickLinksTable() {

    const router = useRouter()
    const linksIndex = Number(router.query.linksIndex)
    const links = useSelector(selectQuickLinks)

    const buttons = []
    if (!links || !links[linksIndex]) return null
    for (let index in links[linksIndex].links) {
        if (links[linksIndex].links[index].SKU) {
            buttons.push(<QuickLinkButton
                key={index}
                itemIndex={Number(index)}
                item={links[linksIndex].links[index]}/>)
        } else {
            buttons.push(<QuickLinkTableAddButton
                key={index}
                id={linksIndex}
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