import {useEffect, useState} from "react";
import {ParcelInfo, SourceData} from "../../api/linnworks/get-parcel-info";
import styles from "./popup-styles.module.css"
import LoadingDiv from "../../../components/layouts/loading";

export default function ParcelInfoPopup(){

    const [yearData, setYearData] = useState<ParcelInfo[]>([])

    useEffect(()=>{
        fetch("/api/linnworks/get-parcel-info")
            .then(res=>res.json())
            .then((data:ParcelInfo[])=>{
                    console.log(data)
                    setYearData(data)
            })
    },[])

    if(yearData.length === 0) return <LoadingDiv/>

    return <div className={styles["parcel-wrapper"]}>
        <Year yearData={yearData[1]}/>
        <Year yearData={yearData[0]}/>
    </div>
}

function Year({yearData}:{yearData:ParcelInfo}){
    if(!yearData) return null
    let sources = []
    for(let data of yearData.data) {
        sources.push(<Source key={data.source} data={data} total={yearData.totals[data.source]}/>)
    }
    return <div className={styles["postal-year"]}>
        <div>{yearData.year} | Total: {yearData.totals.total}</div>
        <div className={styles["postal-source-wrapper"]}>{sources}</div>
    </div>
}

function Source({data, total}:{data:SourceData, total:number}){
    if(!data) return null
    let services = [<PostalService name={data.source} count={total.toString()}/>]
    for(let [k,v] of Object.entries(data.service)) {
        services.push(<PostalService name={k} count={v}/>)
    }
    return <div className={styles["postal-source"]}>
        <div className={styles["postal-service-wrapper"]}>{services}</div>
    </div>
}

function PostalService({name, count}:{name:string, count:string}){
    return <div className={styles["postal-service-row"]}>
        <div>{name}</div>
        <div>{count}</div>
    </div>
}