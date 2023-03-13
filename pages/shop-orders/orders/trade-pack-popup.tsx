import {useDispatch} from "react-redux";
import {setOpenOrderTradePack} from "../../../store/shop-orders-slice";
import styles from '../shop-orders.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

type Props = {
    orderIndex: number,
    itemIndex:number
}

export default function TradePackPopup({orderIndex, itemIndex}: Props){

    const dispatch = useDispatch()

    function selectOptions() {
        const optionsArray = [<option key={0} value={0}>0</option>]
        for(let i = 1; i < 50; i++){
            optionsArray.push(<option key={i} value={i}>{i}</option>)
        }
        return optionsArray
    }

    return (
        <div className={'center-align'}>
        <select onChange={(e) => dispatch(setOpenOrderTradePack({orderIndex:orderIndex, itemIndex:itemIndex, value:parseInt(e.target.value)}))}>
            {selectOptions()}
        </select>
            <span className={`${styles['confirm-span']} button`} onClick={() => dispatchNotification()}>Confirm</span>
        </div>
    )
}