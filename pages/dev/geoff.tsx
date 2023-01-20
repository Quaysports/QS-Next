import {useEffect, useState} from "react";

export default function Geoff() {
    const [calendars, setCalendars] = useState<sbt.holidayCalendar[]>([])

    useEffect(()=>{
        fetch('/api/dev/get-calendars').then(res=>res.json()).then(data=>setCalendars(data))
    },[])

    function convertCalendars(calendars:sbt.holidayCalendar[]){
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
    }

    return (
        <div>
            <h1>Hi Geoff!</h1>
            <button onClick={()=>convertCalendars(calendars)}>Convert Holiday</button>
        </div>
    )
}