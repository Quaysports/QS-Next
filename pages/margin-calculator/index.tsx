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
import {MarginItem, setMarginData} from "../../store/margin-calculator-slice";

export default function marginCalculatorLandingPage() {
    return (
        <div>
            <OneColumn>
                <Menu>
                    <div></div>
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

export const getServerSideProps = appWrapper.getServerSideProps(store => async () => {

    const domestic = false
    let query:MarginQuery = {
        $and: [
            {LISTINGVARIATION: false},
            {IDBFILTER: {$ne: true}},
            {}
        ]
    }
    if (domestic) {
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
        RETAILPRICE:1,
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
    const items = await getItems(query, projection, {SKU:1}) as MarginItem[]

    store.dispatch(setMarginData(items))

    return {props: {}}
})



interface MarginQuery {
    $and:[
        {LISTINGVARIATION:boolean},
        {IDBFILTER:IDBFilter},
        {$or?:any[]}
    ]
}
interface IDBFilter {
    $ne?: boolean | string
    $eq?: boolean | string
}