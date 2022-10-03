import QuickLinksSidebar from "./sidebar";
import QuickLinksTable from "./table";
import {useState} from "react";
import {QuickLinks} from "../../../server-modules/shop/shop"

interface Props {
    links:QuickLinks[]
}

export default function QuickLinksSetup({links}:Props){

    const [id, setId] = useState(links?.length > 0 ? 0 : null)
    const idHandler = (id:number)=> setId(id)

    return(
        <>
            <QuickLinksSidebar id={id} idHandler={idHandler} />
            <QuickLinksTable id={id}/>
        </>
    )
}