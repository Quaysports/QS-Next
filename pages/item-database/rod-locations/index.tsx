import {ReactElement, useEffect, useState} from "react";
import styles from "../item-database.module.css"
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/SidebarButton";
import ColumnLayout from "../../../components/layouts/column-layout";
import {rodLocationObject} from "../index";
import {useSelector} from "react-redux";
import {selectRodLocations} from "../../../store/item-database/item-database-slice";

/**
 * Rod Locations Tab
 */
export default function RodLocationsLandingPage() {

    const [brandFilter, setBrandFilter] = useState<string | null>(null)
    const [mappedRodLocations, setMappedRodLocations] = useState<Map<string, rodLocationObject[]>>(new Map())
    const rodLocations = useSelector(selectRodLocations)

    useEffect(() => {
        let tempMap: Map<string, rodLocationObject[]> = new Map()
        rodLocations?.map((item) => {
            tempMap.has(item.IDBEP.BRAND) ?
                tempMap.get(item.IDBEP.BRAND)!.push(item) : tempMap.set(item.IDBEP.BRAND, [item])
        })
        setMappedRodLocations(tempMap)
    }, [rodLocations])

    function buildFilter() {
        let tempArray: ReactElement[] = []
        mappedRodLocations.forEach((item, key) => {
            tempArray.push(<SidebarButton onClick={() => setBrandFilter(key)}>{key} ({item.length})</SidebarButton>)
        })
        return <div>{tempArray}</div>
    }

    function buildTable() {
        let tempArray = [<div className={styles["rod-location-title"]}><span/><span>SKU</span><span>Title</span><span
            className={"center-align"}>Location</span></div>]
        mappedRodLocations.get(brandFilter!)!.map((item) => {
            tempArray.push(<div className={styles["rod-location-grid-cell"]}>
                <span/>
                <span>{item.SKU}</span>
                <span>{item.TITLE}</span>
                <span className={"center-align"}>{item.BRANDLABEL.loc}</span>
            </div>)
        })
        return <div className={styles["rod-location-grid"]}>{tempArray}</div>
    }

    return (
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