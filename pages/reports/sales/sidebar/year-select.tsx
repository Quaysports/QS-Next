import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectFirstYear, selectLastYear} from "../../../../store/reports/sales-slice";
import {useEffect, useState} from "react";
import SidebarSelect from "../../../../components/layouts/sidebar-select";

export default function YearSelect() {

    const router = useRouter()

    const start = useSelector(selectFirstYear)
    const end = useSelector(selectLastYear)
    const firstYear = new Date(Number(start)).getFullYear()
    const lastYear = new Date(Number(end)).getFullYear()
    const [selectedYear, setSelectedYear] = useState(lastYear.toString())

    useEffect(() => {
        if(router.query.month) delete router.query.month
        router.push({pathname: router.pathname, query: {...router.query, year: selectedYear}})
    },[selectedYear])

    let yearOptions = []
    for (let i = firstYear; i <= lastYear; i++) {
        yearOptions.push(<option key={i} value={i}>{i}</option>)
    }

    return <SidebarSelect role={"year-select"} value={selectedYear} onChange={e=>setSelectedYear(e.target.value)}>
        {yearOptions}
    </SidebarSelect>
}