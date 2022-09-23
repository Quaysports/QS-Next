import {useEffect} from "react";

export default function RodLocationsLandingPage(){

    useEffect(() => {
    fetch("/api/item-database/rod-locations")
        .then(res => res.json())
        .then(res => console.log(res))
    },[])

    return(
        <div>

        </div>
    )
}