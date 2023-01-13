import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import styles from "./popup.module.css"
import {MarginItem, updateMCOverrides} from "../../../store/margin-calculator-slice";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";
import {useDispatch} from "react-redux";
import CopyFromShopButton from "./popup-copy-price-button";
import LinnworksUploadButton from "./popup-linnworks-upload-button";

export default function StatusAndUploadPopup({item}:{item:MarginItem}){

    const content = <div className={styles.wrapper}>
        <div className={styles.table}>
            <TableTitleRow/>
            <TableRow channel={"ebay"} item={item}/>
            <TableRow channel={"amazon"} item={item}/>
            <TableRow channel={"magento"} item={item}/>
        </div>
        <LinnworksUploadButton item={item}/>
        <CopyFromShopButton item={item}/>
    </div>

    return <button
        onClick={()=>{
            dispatchNotification({type:"popup", title:"Channel Status", content:content})
        }}
    >&#129045;</button>
}

function TableTitleRow(){
    return <div className={styles.row}>
        <div>Channel</div>
        <div>Linnworks</div>
        <div>Margin</div>
        <div>Difference</div>
        <div>Status</div>
        <div>Override</div>
    </div>
}

function TableRow({channel, item}:{channel:"ebay" | "amazon" | "magento", item:MarginItem}){

    const dispatch = useDispatch()
    const marginOverrideKey = `${channel}Override` as "ebayOverride" | "amazonOverride" | "magentoOverride"

    let channelPrice = item.channelPrices[channel].price
    let marginPrice = item.prices[channel]
    let status = item.channelPrices[channel].status
    let flag = item.checkboxStatus.marginCalculator[marginOverrideKey]

    let difference = Number(channelPrice) - Number(marginPrice)

    function generateStatusText(status?:number){
        switch(status){
            case 3 || 5: return "Confirmed"
            case 1 || 2: return "Pending"
            case 99: return "Error"
            default: return ""
        }
    }

    let statusText = generateStatusText(status)

    if(!item) return null
    return <div className={styles.row}>
        <div>{channel}</div>
        <div>{toCurrency(Number(channelPrice))}</div>
        <div>{toCurrency(Number(marginPrice))}</div>
        <div className={difference !== 0 ? styles["red-text"] : styles["green-text"]}>
            {toCurrency(difference)}
        </div>
        <div className={styles[statusText]}>{statusText}</div>
        <div>
            <input type={"checkbox"}
                   defaultChecked={flag}
                   onChange={async (e)=>{
                       dispatch(updateMCOverrides({item:item, key:marginOverrideKey, value:e.target.checked}))
                   }}/>
        </div>
    </div>
}