import {useEffect, useState} from "react";
import styles from "../item-database.module.css"
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/SidebarButton";
import ColumnLayout from "../../../components/layouts/column-layout";

interface rodLocationObject {
    BRANDLABEL:{loc:string},
    IDBEP:{BRAND:string},
    SKU:string,
    TITLE:string,
    _id: string
}

export default function RodLocationsLandingPage(){

    const [rodLocations, setRodLocations] = useState<Map<string, rodLocationObject[]>>(new Map())
    const [brandFilter, setBrandFilter] = useState<string>(null)

    useEffect(() => {
    fetch("/api/item-database/rod-locations")
        .then(res => res.json())
        .then(res => {
            let sortedData = res.sort((a, b) => {
                if (!a.IDBEP.BRAND) a.IDBEP.BRAND = "Default"
                if (!b.IDBEP.BRAND) b.IDBEP.BRAND = "Default"
                return a.IDBEP.BRAND.localeCompare(b.IDBEP.BRAND)
            })
            let tempMap = new Map()
            sortedData.map((item) => {
                tempMap.has(item.IDBEP.BRAND) ?
                    tempMap.get(item.IDBEP.BRAND).push(item) : tempMap.set(item.IDBEP.BRAND, [item])
            })
          setRodLocations(tempMap)
        })

    },[])

    function buildFilter(){
        let tempArray = []
        rodLocations.forEach((item, key) => {
            tempArray.push(<SidebarButton onClick={() => setBrandFilter(key)}>{key} ({item.length})</SidebarButton>)
        })
        return <div>{tempArray}</div>
    }

    function buildTable() {
        let tempArray = [<div className={styles["rod-location-title"]}><span/><span>SKU</span><span>Title</span><span className={"center-align"}>Location</span></div>]
        rodLocations.get(brandFilter).map((item) => {
            tempArray.push(<div className={styles["rod-location-grid-cell"]}>
                <span/>
                <span>{item.SKU}</span>
                <span>{item.TITLE}</span>
                <span className={"center-align"}>{item.BRANDLABEL.loc}</span>
            </div>)
        })
        return <div className={styles["rod-location-grid"]}>{tempArray}</div>
    }


    return(
        <>
        <SidebarLayout>
            {rodLocations ? "Suppliers" : null}
            {rodLocations ? buildFilter() : null}
        </SidebarLayout>
        <ColumnLayout>
            {brandFilter ? buildTable() : null}
        </ColumnLayout>
        </>
    )
}