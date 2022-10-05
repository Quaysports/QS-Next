import QuickLinksSidebar from "./sidebar";
import QuickLinksTable from "./table";
/**
 * Quick Links tab, accesses links array and sets loaded links to first in the array
 */
export default function QuickLinks(){

    return(
        <>
            <QuickLinksSidebar/>
            <QuickLinksTable/>
        </>
    )
}