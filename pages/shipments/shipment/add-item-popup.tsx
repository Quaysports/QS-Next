import {useDispatch} from "react-redux";
import DatabaseSearchBar, {DatabaseSearchItem} from "../../../components/database-search-bar/database-search";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {addItemToShipmentData} from "../../../store/shipments-slice";

export default function AddItemPopup(){
    const dispatch = useDispatch()
    const handler = (value:DatabaseSearchItem)=> {
        dispatchNotification()
        dispatch(addItemToShipmentData( {
            billDesc: "",
            code: "",
            desc: value.title,
            dollarTotal: 0,
            dutyPer: "",
            dutyValue: 0,
            fobDollar: "",
            fobPound: 0,
            height: "",
            hscode: "",
            length: "",
            m3perBox: 0,
            m3total: 0,
            numOfBoxes: 0,
            orderid: "",
            perOfOrder: 0,
            poundTotal: 0,
            qty: "",
            qtyPerBox: "",
            sku: value.SKU,
            supplier: "",
            totalPerItem: 0,
            width: ""

        }))
    }
    return <><DatabaseSearchBar handler={handler}
                                searchOptions={{
                                    isComposite:false,
                                    isListingVariation:false,
                                    tags:{$nin:["domestic"]}
                                }}/></>
}