import styles from "./geoff.module.css"

export default function Geoff() {
    //const [calendars, setCalendars] = useState<sbt.holidayCalendar[]>([])

    /*function convertCalendars(calendars:sbt.holidayCalendar[]){
        console.log(calendars)
        for(let calendar of calendars){
            let clone = structuredClone(calendar)
            for(let month of clone.template){
                for(let day of month.days){
                    if(day.booked){
                        convertBooked(day.booked)
                    }
                }
            }
            console.log(clone)
            let opts = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(clone)
            }
            fetch('/api/holiday-calendar/update-calendar', opts)
        }
    }

    function convertBooked(booked:sbt.holidayDay["booked"]){
        for(let user in booked){
            // @ts-ignore
            if(booked[user] === true){
                booked[user] = {type:"holiday", paid:true, duration:100}
            }
            // @ts-ignore
            if(booked[user] === "half"){
                booked[user] = {type:"holiday", paid:true, duration:50}
            }
        }
    }*/

    function mapItem(k: any, v: any, merge: any) {
        if (!v) return
        if (typeof v !== "object") {
            merge[k] = typeof v
        } else {
            if (Array.isArray(v)) {
                let arrayType: any = {}
                if (typeof v[0] !== "object") {
                    if (v[0] !== undefined) merge[k] = [typeof v[0]]
                } else {
                    for (let [ak1, av1] of Object.entries(v[0])) {
                        arrayType[ak1] = typeof av1
                    }
                    merge[k] = [arrayType]
                }
            } else {
                for (let [k1, v1] of Object.entries(v)) {
                    merge[k] ??= {}
                    mapItem(k1, v1, merge[k])
                }
            }
        }
    }

    function processItemTypes(item: any, merge: any) {
        for (let [k, v] of Object.entries(item)) {
            mapItem(k, v, merge);
        }
        return merge
    }

    return (
        <div className={styles["button-container"]}>
            <h1>Hi Geoff!</h1>
            <button disabled onClick={() => fetch('/api/dev/convert-shop-to-till-transactions')}>Convert Till Transactions</button>
            <button disabled onClick={() => fetch('/api/dev/convert-fees')}>Convert Fees</button>
            <button disabled onClick={() => fetch('/api/dev/convert-postage')}>Convert Postage</button>
            <button disabled onClick={() => fetch('/api/dev/convert-packaging')}>Convert Packaging</button>
            <button disabled onClick={() => fetch('/api/dev/convert-prices')}>Convert Prices</button>
            <button disabled onClick={() => fetch('/api/dev/convert-giftcard')}>Convert Giftcard</button>
            <button onClick={() => fetch('/api/dev/calculate-till-profits')}>Till Profits</button>
            <button onClick={() => fetch('/api/dev/report-worker-test').then(res=>res.json().then(json=>console.log(json)))}>Report Worker</button>
        </div>
    )
}