import styles from"./sales-report.module.css";
import {useRouter} from "next/router";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import TillTransactionCSVPopup from "./till-transaction-csv-popup";
import {useSelector} from "react-redux";
import {selectFirstYear, selectLastYear} from "../../../store/reports/sales-slice";
import {useEffect, useState} from "react";

export default function TableMenu(){
    const router = useRouter()
    const location = router.query.location ?? "shop"

    return(
        <div className={styles.menu}>
            <YearSelect/>
            <MonthSelect/>
            <div>
            {location === "shop"
                ? <button onClick={()=>dispatchNotification({
                    type:"popup",
                    title:"Till Transaction CSV",
                    content:<TillTransactionCSVPopup/>
                })}>Till Transaction CSV</button>
                : null
            }
            </div>
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