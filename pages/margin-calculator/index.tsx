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
    MarginItem,
    selectMarginData,
    selectRenderedItems, setFees,
    setMarginData, setPackaging, setPostage,
    setSearchItems
} from "../../store/margin-calculator-slice";
import MarginCalculatorMenuTabs from "./tabs";
import {useDispatch, useSelector} from "react-redux";

export default function marginCalculatorLandingPage() {

    const dispatch = useDispatch()
    const items = useSelector(selectMarginData)

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
                    <div className={styles.table}>
                        <InfoTable/>
                        <CostsTable/>
                        <EbayTable/>
                        <AmazonTable/>
                        <MagentoTable/>
                        <ShopTable/>
                        <MiscTable/>
                    </div>
                </ColumnLayout>
            </OneColumn>
        </div>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    const domestic = context.query.domestic

    let query: MarginQuery = {
        $and: [
            {LISTINGVARIATION: false},
            {IDBFILTER: {$ne: true}},
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

    console.dir(query, {depth:5})

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

    store.dispatch(setMarginData(items))

    store.dispatch(setFees(await Fees.get()))
    store.dispatch(setPostage(await Postage.get()))
    store.dispatch(setPackaging(await Packaging.get()))

    return {props: {}}
})


interface MarginQuery {
    $and: [
        { LISTINGVARIATION: boolean },
        { IDBFILTER: IDBFilter },
        { $or?: any[] }
    ]
}

interface IDBFilter {
    $ne?: boolean | string
    $eq?: boolean | string
}