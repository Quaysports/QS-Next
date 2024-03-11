import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import styles from "./popup.module.css"
import {MarginItem, selectUploadedIndexes, updateMCOverrides} from "../../../store/margin-calculator-slice";
import {toCurrency} from "../../../components/utils/utils";
import {useDispatch, useSelector} from "react-redux";
import CopyFromShopButton from "./popup-copy-price-button";
import LinnworksUploadButton from "./popup-linnworks-upload-button";
import { useRouter } from "next/router";

export default function StatusAndUploadPopup({item, index}: { item: MarginItem, index: string }) {

    const router = useRouter()
    const domestic = router.query.domestic === "true";

    const uploadedIndexes = useSelector(selectUploadedIndexes)
    if(!item) return null
    function checkPriceMismatch() {
        if(uploadedIndexes.includes(index)) return styles["upload-button-uploaded"]
        let mismatch = false
        let channels = ["ebay", "amazon", "magento"] as const
        for (let channel of channels) {
            if (item.prices[channel] !== item.channelPrices[channel].price) mismatch = true
        }
        return mismatch ? styles["upload-button-mismatch"] : styles["upload-button"]
    }

    const content = <div className={styles.wrapper}>
        <div className={styles.table}>
            <TableTitleRow/>
            <TableRow channel={"ebay"} item={item}/>
            <TableRow channel={"amazon"} item={item}/>
            <TableRow channel={"magento"} item={item}/>
            {domestic ? <TableRow channel={"magentoSpecial"} item={item}/> : null}
        </div>
        <LinnworksUploadButton item={item} index={index}/>
        <CopyFromShopButton item={item}/>
    </div>

    return <button className={checkPriceMismatch()}
                   onClick={() => {
                       dispatchNotification({type: "popup", title: "Channel Status", content: content})
                   }}
    >&#129045;</button>
}

function TableTitleRow() {
    return <div className={styles.row}>
        <div>Channel</div>
        <div>Linnworks</div>
        <div>Margin</div>
        <div>Difference</div>
        <div>Status</div>
        <div>Override</div>
    </div>
}

// function TableRow({channel, item}: { channel: "ebay" | "amazon" | "magento" | "magentoSpecial", item: MarginItem}) {

//     const dispatch = useDispatch()
//     const marginOverrideKey = `${channel}Override` as "ebayOverride" | "amazonOverride" | "magentoOverride"

//     let channelPrice 
//     if (channel !== "magentoSpecial") {
//         channelPrice = item.channelPrices[channel].price
//     } else { // special price for Linnworks is checked via extendedProperties
//         let specialPriceIndex = item.extendedProperties.findIndex(prop => prop.epName === "Special Price")
//         if (specialPriceIndex !== -1) {
//             channelPrice = +item.extendedProperties[specialPriceIndex].epValue * 100
//         } else channelPrice = 0.00
//     }
//     let marginPrice = item.prices[channel]
//     let status
//     if (channel !== "magentoSpecial") {
//         status = item.channelPrices[channel].status
//     } 
//     let flag = item.checkboxStatus.marginCalculator[marginOverrideKey]
//     let difference = Number(channelPrice) - Number(marginPrice)
//     function generateStatusText(status?: number) {
//         switch (status) {
//             case 3 || 5:
//                 return "Confirmed"
//             case 1 || 2:
//                 return "Pending"
//             case 99:
//                 return "Error"
//             default:
//                 return ""
//         }
//     }

//     let statusText = generateStatusText(status)

//     if (!item) return null
//     return <div className={styles.row}>
//         <div>{channel !== "magentoSpecial" ? channel : "special"}</div>
//         <div>{toCurrency(Number(channelPrice))}</div>
//         <div>{toCurrency(Number(marginPrice))}</div>
//         <div className={difference !== 0 ? styles["red-text"] : styles["green-text"]}>
//             {toCurrency(difference)}
//         </div>
//         <div className={styles[statusText]}>{statusText}</div>
//         <div>
//             {channel !== "magentoSpecial" ? <input type={"checkbox"}
//                 defaultChecked={flag}
//                 onChange={async (e) => {
//                     dispatch(updateMCOverrides({item: item, key: marginOverrideKey, value: e.target.checked}))
//                 }}/> : null}
//         </div>
//         </div>
// }

function TableRow({channel, item}: { channel: "ebay" | "amazon" | "magento" | "magentoSpecial", item: MarginItem}) {

    const dispatch = useDispatch()
    const marginOverrideKey = `${channel}Override` as "ebayOverride" | "amazonOverride" | "magentoOverride"

    let channelPrice 
    if (channel !== "magentoSpecial") {
        channelPrice = item.channelPrices[channel].price
    } else { // special price for Linnworks is checked via extendedProperties
        let specialPriceIndex = item.extendedProperties?.findIndex(prop => prop.epName === "Special Price")
        if (specialPriceIndex !== -1 && item.extendedProperties) {
            channelPrice = +item.extendedProperties[specialPriceIndex].epValue * 100
        } else channelPrice = 0.00
    }
    let marginPrice = item.prices[channel]
    let status
    if (channel !== "magentoSpecial") {
        status = item.channelPrices[channel].status
    } 
    let flag = item.checkboxStatus.marginCalculator[marginOverrideKey]
    let difference = Number(channelPrice) - Number(marginPrice)
    function generateStatusText(status?: number) {
        switch (status) {
            case 3 || 5:
                return "Confirmed"
            case 1 || 2:
                return "Pending"
            case 99:
                return "Error"
            default:
                return ""
        }
    }

    let statusText = generateStatusText(status)

    if (!item) return null
    return <div className={styles.row}>
        <div>{channel !== "magentoSpecial" ? channel : "special"}</div>
        <div>{toCurrency(Number(channelPrice))}</div>
        <div>{toCurrency(Number(marginPrice))}</div>
        <div className={difference !== 0 ? styles["red-text"] : styles["green-text"]}>
            {toCurrency(difference)}
        </div>
        <div className={styles[statusText]}>{statusText}</div>
        <div>
            {channel !== "magentoSpecial" ? <input type={"checkbox"}
                defaultChecked={flag}
                onChange={async (e) => {
                    dispatch(updateMCOverrides({item: item, key: marginOverrideKey, value: e.target.checked}))
                }}/> : null}
        </div>
        </div>
}
