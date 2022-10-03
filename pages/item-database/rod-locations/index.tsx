import {ReactElement, useEffect, useState} from "react";
import styles from "../item-database.module.css"
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/SidebarButton";
import ColumnLayout from "../../../components/layouts/column-layout";
import {rodLocationObject} from "../index";

interface Props {
    rodLocations: Map<string, rodLocationObject[]>
}

export default function RodLocationsLandingPage(props:Props){

    const [brandFilter, setBrandFilter] = useState<string | null>(null)

    useEffect(() => {

    },[])

    function buildFilter(){
        let tempArray:ReactElement[] = []
        props.rodLocations.forEach((item, key) => {
            tempArray.push(<SidebarButton onClick={() => setBrandFilter(key)}>{key} ({item.length})</SidebarButton>)
        })
        return <div>{tempArray}</div>
    }

    function buildTable() {
        let tempArray = [<div className={styles["rod-location-title"]}><span/><span>SKU</span><span>Title</span><span className={"center-align"}>Location</span></div>]
        props.rodLocations.get(brandFilter!)!.map((item) => {
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
            {props.rodLocations ? "Suppliers" : null}
            {props.rodLocations ? buildFilter() : null}
        </SidebarLayout>
        <ColumnLayout>
            {brandFilter ? buildTable() : null}
        </ColumnLayout>
        </>
    )
}