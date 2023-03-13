import { Shipment, ShipmentItem } from '../../../server-modules/shipping/shipping';
import { useDispatch } from 'react-redux';
import { updateShipment } from '../../../store/shipments-slice'
import { dispatchNotification } from '../../../components/notification/dispatch-notification';
import RegexInput from '../../../components/regex-input';
import { useState } from 'react';

export default function TransferPopup({item, fromShipment, toShipment}:{item: ShipmentItem, fromShipment:Shipment, toShipment:Shipment}) {

  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(item?.qty ? Number(item.qty) : 0)
  
  if(!item || !fromShipment || !toShipment) return null

  let from = structuredClone(fromShipment)
  let to =  structuredClone(toShipment)

  const inputHandler = (value:string) => setQuantity(Number(value))

  function transfer(){
    
    const fromPos = from.data.findIndex(fromItems => fromItems.sku === item.sku && fromItems.code === item.code)
    const toPos = to.data.findIndex(toItems => toItems.sku === item.sku && toItems.code === item.code)

    if(fromPos === -1) return
    
    if(toPos === -1){
      let movedItem = structuredClone(from.data[fromPos])
      movedItem.qty = String(quantity)
      const newAmount = +from.data[fromPos].qty - quantity
      from.data[fromPos].qty = newAmount.toString() 
      to.data.push(movedItem)
    } else {
      const newFromAmount = +from.data[fromPos].qty - quantity
      const newToAmount = +to.data[toPos].qty + quantity
      from.data[fromPos].qty = newFromAmount.toString()
      to.data[toPos].qty = newToAmount.toString()
    }
    
    if(Number(from.data[fromPos].qty) <= 0) from.data.splice(fromPos, 1);

    dispatch(updateShipment(from))
    dispatch(updateShipment(to))
    dispatchNotification()

  }

  return <div>
  <div>How many items would you like to transfer?</div>
  <div><RegexInput value={quantity} type={"number"} handler={inputHandler} errorMessage={"Numbers only"}/></div>
  <div><button onClick={transfer}>Transfer</button></div>
  </div>
}
