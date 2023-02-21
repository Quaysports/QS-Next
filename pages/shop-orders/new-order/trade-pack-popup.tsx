import {useDispatch} from "react-redux";
import {setTradePack} from "../../../store/shop-orders-slice";
import styles from '../shop-orders.module.css'
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

type Props = {
    index:number
}

export default function TradePackPopup({index}: Props){

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
        <select onChange={(e) => dispatch(setTradePack({index:index, value:parseInt(e.target.value)}))}>
            {selectOptions()}
        </select>
            <span className={`${styles['confirm-span']} button`} onClick={() => dispatchNotification()}>Confirm</span>
        </div>
    )
}