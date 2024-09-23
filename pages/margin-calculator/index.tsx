import Menu from "../../components/menu/menu";
import ColumnLayout from "../../components/layouts/column-layout";
import styles from "./margin-calculator.module.css";
import OneColumn from "../../components/layouts/one-column";
import InfoTable from "./info-table";
import CostsTable from "./costs-table";
import EbayTable from "./ebay-table";
import AmazonTable from "./amazon-table";
import MagentoTable from "./magento-table";
import MiscTable from "./misc-table";
import OnBuyTable from "./onbuy-table";
import {appWrapper} from "../../store/store";
import {getBrands, getItems, getStockValues} from "../../server-modules/items/items";
import * as Fees from "../../server-modules/fees/fees"
import * as Packaging from "../../server-modules/packaging/packaging"
import * as Postage from "../../server-modules/postage/postage"
import {
    incrementThreshold,
    MarginItem,
    selectMarginData,
    setFees,
    setMarginData, setPackaging, setPostage,
    setSearchItems, setSuppliers, setTotalStockValue
} from "../../store/margin-calculator-slice";
import MarginCalculatorMenuTabs from "./tabs";
import {useDispatch, useSelector} from "react-redux";
import PricesTable from "./prices-table";
import InfiniteScroll from "../../components/infinite-scroll";
import StatsTable from "./stats-table";
import {getSession} from "next-auth/react";
import {getUserSettings} from "../../server-modules/users/user";
import {updateSettings} from "../../store/session-slice";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {useEffect} from "react";

export default function marginCalculatorLandingPage({loaded = false}) {

    const dispatch = useDispatch()
    const items = useSelector(selectMarginData)

    const updateItemsHandler = (items: MarginItem[]) => {
        document.getElementById("column-layout")?.scroll(0,0)
        dispatch(setSearchItems(items))
    }

    useEffect(()=>dispatchNotification(),[items])

    if(!loaded) return null

    return (
        <div>
            <OneColumn>
                <Menu>
                    <MarginCalculatorMenuTabs searchData={items} updateItemsHandler={updateItemsHandler}/>
                </Menu>
                <ColumnLayout background={false} scroll={true} stickyTop={true}>
                    <InfiniteScroll incrementReducer={incrementThreshold}>
                        <div className={styles.table}>
                            <InfoTable/>
                            <PricesTable/>
                            <StatsTable/>
                            <CostsTable/>
                            <EbayTable/>
                            <AmazonTable/>
                            <MagentoTable/>
                            <OnBuyTable/>
                            <MiscTable/>
                        </div>
                    </InfiniteScroll>
                </ColumnLayout>
            </OneColumn>
        </div>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    const domestic = context.query.domestic === "true"
    const brand = context.query.brand
    const show = context.query.show === "true"
    const session = await getSession(context)
    const user = await getUserSettings(session?.user.username)
    if(user?.settings) store.dispatch(updateSettings(user!.settings))

    let query: MarginQuery = {
        $and: [
            {isListingVariation: false},
            {tags: {
                $nin: ["filtered"]
            }},
        ]
    }

    if (domestic) {
        query.$and[1].tags.$in = ['domestic', 'bait']
    }

    if(!domestic) {
        query.$and[1].tags.$nin = [...query.$and[1].tags.$nin, 'domestic', 'bait']
    }

    if(brand){
        query.$and.push({brand:brand})
    }

    if(!show) { query.$and.push({"checkboxStatus.marginCalculator.hide":{$ne:true}}) }

    console.dir(query, {depth: 5})

    const projection = {
        SKU: 1,
        title: 1,
        postage: 1,
        stock: 1,
        marginNote: 1,
        marginData: 1,
        linnId: 1,
        checkboxStatus: 1,
        packaging:1,
        prices:1,
        channelPrices:1,
        channelData:1,
        brand:1,
        discounts:1,
        mappedExtendedProperties:1,
        // extendedProperties: 1
        extendedProperties: {
            $filter: {
                input: "$extendedProperties",
                as: "ep",
                cond: { $eq: ["$$ep.epName", "Special Price"] }
            }
        }
    }

    const items = await getItems(query, projection, {SKU: 1}) as MarginItem[]
    if(items) store.dispatch(setMarginData(items))

    const stockValues = await getStockValues(domestic)
    if(stockValues) store.dispatch(setTotalStockValue(stockValues[0].total))

    const suppliers = await getBrands(query) as string[]
    if(suppliers) store.dispatch(setSuppliers(suppliers))

    const fees = await Fees.get()
    if(fees) store.dispatch(setFees(fees))

    const postage = await Postage.get()
    if(postage) store.dispatch(setPostage(postage))

    let packaging = await Packaging.get()
    if(packaging) store.dispatch(setPackaging(packaging))

    return {props: {loaded:true}}
})


interface MarginQuery {
    $and: [
        { isListingVariation: boolean },
        { tags: {
                $in?: string[]
                $nin: string[]
            }
        },
        { brand?:string | string[]}?,
        { "checkboxStatus.marginCalculator.hide"?: {$ne:true} }?,
        { $or?: any[] }?
    ]
}