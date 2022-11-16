import Menu from "../../components/menu/menu";
import ColumnLayout from "../../components/layouts/column-layout";
import styles from "./margin-calculator.module.css";
import OneColumn from "../../components/layouts/one-column";
import InfoTable from "./info-table";
import CostsTable from "./costs-table";
import EbayTable from "./ebay-table";
import AmazonTable from "./amazon-table";
import MagentoTable from "./magento-table";
import ShopTable from "./shop-table";
import MiscTable from "./misc-table";
import {appWrapper} from "../../store/store";
import {getItems} from "../../server-modules/items/items";
import * as Fees from "../../server-modules/fees/fees"
import * as Packaging from "../../server-modules/packaging/packaging"
import * as Postage from "../../server-modules/postage/postage"

import {
    incrementThreshold,
    MarginItem,
    selectMarginData, selectMaxThreshold, selectThreshold,
    setFees,
    setMarginData, setPackaging, setPostage,
    setSearchItems
} from "../../store/margin-calculator-slice";
import MarginCalculatorMenuTabs from "./tabs";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import useIntersectObserver from "../../components/hooks/use-intersection-observer";

/* ToDO:

    test column for QS?

    Fees menu
    Postage menu
    Packaging menu

    Test item menu / tool
    Remove override button / script
    Un-hide all button / script
    Update all button
    Update CP button

    Loading indicators
 */


export default function marginCalculatorLandingPage() {

    const dispatch = useDispatch()
    const items = useSelector(selectMarginData)

    const maxThreshold = useSelector(selectMaxThreshold)
    const threshold = useSelector(selectThreshold)
    const observedElement = useRef<HTMLDivElement>(null)
    const intersectionElement = useRef<HTMLDivElement | null>(null)

    const scrollHandler = ()=> dispatch(incrementThreshold())
    //useIntersectObserver(intersectionElement, observedElement, threshold, maxThreshold, items, scrollHandler)

    useEffect(()=>{
        intersectionElement.current = document!.getElementById("column-layout") as HTMLDivElement
    },[])

    const updateItemsHandler = (items: MarginItem[]) => {
        document.getElementById("column-layout")?.scroll(0,0)
        dispatch(setSearchItems(items))
    }

    return (
        <div>
            <OneColumn>
                <Menu>
                    <MarginCalculatorMenuTabs searchData={items} updateItemsHandler={updateItemsHandler}/>
                </Menu>
                <ColumnLayout background={false} scroll={true} stickyTop={true}>
                    {items ? <div className={styles.table}>
                        <InfoTable/>
                        <CostsTable/>
                        <EbayTable/>
                        <AmazonTable/>
                        <MagentoTable/>
                        <ShopTable/>
                        <MiscTable/>
                        <div style={{gridColumn:"1/7"}} ref={observedElement}></div>
                    </div> : null}
                </ColumnLayout>
            </OneColumn>
        </div>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    const domestic = context.query.domestic
    const show = context.query.show

    let query: MarginQuery = {
        $and: [
            {LISTINGVARIATION: false},
            {IDBFILTER: {$ne: true}},
            {},
            {}
        ]
    }
    if (domestic === "true") {
        query.$and.push(
            {
                $or: [
                    {IDBFILTER: {$eq: 'domestic'}},
                    {IDBFILTER: {$eq: 'bait'}}
                ]
            })

    } else {
        query.$and.push({IDBFILTER: {$ne: 'domestic'}})
        query.$and.push({IDBFILTER: {$ne: 'bait'}})
    }


    if(!show || show === "false") { query.$and.push({HIDE:{$ne:true}}) }


    const projection = {
        SKU: 1,
        TITLE: 1,
        POSTID: 1,
        POST: 1,
        POSTMODID: 1,
        STOCKVAL: 1,
        STOCKTOTAL: 1,
        MARGINNOTE: 1,
        MD: 1,
        LINNID: 1,
        HIDE: 1,
        PACKGROUP: 1,
        PACKAGINGPRICE: 1,
        POSTUKNOTSTD: 1,
        PURCHASEPRICE: 1,
        RETAILPRICE: 1,
        CP: 1,
        CD: 1,
        EBAYPRICEINCVAT: 1,
        AMZPRICEINCVAT: 1,
        QSPRICEINCVAT: 1,
        SHOPPRICEINCVAT: 1,
        AMZPRIME: 1,
        IDBEP: 1,
        IDBFILTER: 1,
        MCOVERRIDES: 1
    }
    const items = await getItems(query, projection, {SKU: 1}) as MarginItem[]
    if(items) store.dispatch(setMarginData(items))

    const fees = await Fees.get()
    if(fees) store.dispatch(setFees(fees))

    const postage = await Postage.get()
    if(postage) store.dispatch(setPostage(postage))

    let packaging = await Packaging.get()
    if(packaging) store.dispatch(setPackaging(packaging))

    return {props: {}}
})


interface MarginQuery {
    $and: [
        { LISTINGVARIATION: boolean },
        { IDBFILTER: IDBFilter },
        { HIDE?: {$ne:true} },
        { $or?: any[] }
    ]
}

interface IDBFilter {
    $ne?: boolean | string
    $eq?: boolean | string
}