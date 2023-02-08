import ReportRibbon from "../components/report-ribbon";
import ReportSelect from "../components/report-select";

export default function OnlineReports(){

    const ribbonBuilder = () => {
        return <ReportRibbon/>
    }

    return (
        <>
            <ReportSelect/>
            <ReportSelect/>
            {ribbonBuilder()}
        </>
    )
}