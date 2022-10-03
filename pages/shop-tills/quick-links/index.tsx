import QuickLinksSidebar from "./sidebar";
import QuickLinksTable from "./table";
import {useState} from "react";

export default function QuickLinksSetup({links}){

    const [id, setId] = useState(links?.length > 0 ? 0 : null)
    const idHandler = (id)=> setId(id)

    return(
        <>
            <QuickLinksSidebar id={id} idHandler={idHandler} />
            <QuickLinksTable id={id}/>
        </>
    )
}