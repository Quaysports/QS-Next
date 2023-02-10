import {useSelector} from "react-redux";
import {selectFirstYear, selectLastYear} from "../../../store/reports/sales-slice";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function SalesReportTable(){
    return(
        <div>
            <YearSelect/><MonthSelect/>
        </div>
    )
}

function YearSelect() {

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

    return <select role={"year-select"} value={selectedYear} onChange={e=>setSelectedYear(e.target.value)}>
        {yearOptions}
    </select>
}

function MonthSelect(){
    const router = useRouter()
    const months = ["", "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"]
    const [selectedMonth, setSelectedMonth] = useState(router.query.month ?? 0)

    useEffect(() => {
        if(!router.query.month) setSelectedMonth(0)
    },[router.query])

    useEffect(()=>{
        if(selectedMonth === 0){
            if(router.query.month) delete router.query.month
            router.push({pathname: router.pathname, query: {...router.query}})
            setSelectedMonth(selectedMonth)
            return
        }
        router.push({pathname: router.pathname, query: {...router.query, month: selectedMonth}})
        setSelectedMonth(selectedMonth)
    }, [selectedMonth])

    let monthOptions = []
    for (let i = 0; i < months.length; i++) {
        monthOptions.push(<option key={i} value={i}>{months[i]}</option>)
    }

    return <select role={"month-select"} value={selectedMonth} onChange={e=>setSelectedMonth(Number(e.target.value))}>
        {monthOptions}
    </select>
}