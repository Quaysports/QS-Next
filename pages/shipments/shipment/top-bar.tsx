import {Shipment} from '../../../server-modules/shipping/shipping'
import RegexInput from '../../../components/regex-input'
import {useSelector} from 'react-redux'
import {
  selectShipment,
  setShipment,
  updateShipment,
  selectShippingCompanies
} from '../../../store/shipments-slice'
import { useDispatch } from 'react-redux'
import styles from '../shipment.module.css'

export default function TopBar() {
  const shipment = useSelector(selectShipment)
  const shippingCompanies = useSelector(selectShippingCompanies)
  const dispatch = useDispatch()

  if(!shipment) return null

  let shippingCompanyList = []
  for(const data of shippingCompanies){
    shippingCompanyList.push(<option key={data.company} value={data.company}/>)
  }

  function update<T>(obj:T, key: keyof T, value: T[keyof T]){
    let update = structuredClone(obj)
    update[key] = value
    return update
  }

  return <div className={styles["top-bar"]}>
    <div className={styles["top-bar-intId"]}>
      <label>Internal ID:</label>
      <input value={shipment.intId}
             onBlur={()=>dispatch(updateShipment(shipment))}
             onChange={(e)=>dispatch(setShipment(update<Shipment>(shipment, "intId", e.target.value)))}/>
    </div>
    <div className={styles["top-bar-tag"]}>
      <label>Card Title:</label>
      <input value={shipment.tag}
             onBlur={()=>dispatch(updateShipment(shipment))}
             onChange={(e)=>dispatch(setShipment(update<Shipment>(shipment, "tag", e.target.value)))}/>
    </div>
    <div className={styles["top-bar-shippingCompany"]}>
      <label>Shipping Company:</label>
      <input value={shipment.shippingCompany}
             list={"shippingCompanies"}
             onBlur={()=>dispatch(updateShipment(shipment))}
             onChange={(e)=>dispatch(setShipment(update<Shipment>(shipment, "shippingCompany", e.target.value)))}/>
      <datalist id="shippingCompanies">{shippingCompanyList}</datalist>
    </div>
    <div className={styles["top-bar-shipRef"]}>
      <label>Shipping Reference:</label>
      <input value={shipment.shipRef}
             onBlur={()=>dispatch(updateShipment(shipment))}
             onChange={(e)=>dispatch(setShipment(update<Shipment>(shipment,"shipRef",e.target.value)))}/>
    </div>
    <div className={styles["top-bar-exchangeRate"]}>
      <label>Exchange Rate:</label>
      <RegexInput value={shipment.exchangeRate} 
                  type={"decimal"} 
                  handler={(value)=>dispatch(updateShipment(update(shipment, "exchangeRate", Number(value))))} errorMessage={"Numbers only."}/>
    </div>
    <div className={styles["top-bar-due"]}>
      <label>Due:</label>
      <input value={shipment.due.split("T")[0]}
             type={"date"}
             onBlur={()=>dispatch(updateShipment(shipment))}
             onChange={(e)=>dispatch(setShipment(update<Shipment>(shipment,"due",new Date(e.target.value).toISOString())))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Booked:</label>
      <input checked={shipment.booked}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"booked",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Confirmed:</label>
      <input checked={shipment.confirmed}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"confirmed",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>At Sea:</label>
      <input checked={shipment.atSea}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"atSea",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Delivery Arranged:</label>
      <input checked={shipment.delivery}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"delivery",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Overdue:</label>
      <input checked={shipment.overdue}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"overdue",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Ready:</label>
      <input checked={shipment.ready}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"ready",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Delivered:</label>
      <input checked={shipment.delivered}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(shipment,"delivered",e.target.checked)))}/>
    </div>
  </div>
}