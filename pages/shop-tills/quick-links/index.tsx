import QuickLinksSidebar from "./sidebar";
import QuickLinksTable from "./table";
import {useState} from "react";
import {selectQuickLinks} from "../../../store/shop-tills/quicklinks-slice";
import {useSelector} from "react-redux";

export default function QuickLinks(){

    const links = useSelector(selectQuickLinks)
    const [id, setId] = useState<number | null>(links && links.length > 0 ? 0 : null)
    const idHandler = (id:number)=> setId(id)

    if(id === null) return null

    return(
        <>
            <QuickLinksSidebar id={id} idHandler={idHandler} />
            <QuickLinksTable id={id}/>
        </>
    )
}