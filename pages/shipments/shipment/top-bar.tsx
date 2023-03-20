import {Shipment} from '../../../server-modules/shipping/shipping'
import RegexInput from '../../../components/regex-input'
import {useSelector} from 'react-redux'
import {
  selectShipment,
  updateShipment,
  selectShippingCompanies
} from '../../../store/shipments-slice'
import { useDispatch } from 'react-redux'
import styles from '../shipment.module.css'
import {useEffect, useState} from "react";

export default function TopBar() {
  const shipment = useSelector(selectShipment)
  useEffect(()=>setLocalShipment(structuredClone(shipment)),[shipment])
  const [localShipment, setLocalShipment] = useState<Shipment | null>(structuredClone(shipment))
  const shippingCompanies = useSelector(selectShippingCompanies)
  const dispatch = useDispatch()

  if(!localShipment || !shipment) return null

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
      <input value={localShipment.intId}
             onBlur={()=>dispatch(updateShipment(localShipment))}
             onChange={(e)=>setLocalShipment(update<Shipment>(localShipment, "intId", e.target.value))}/>
    </div>
    <div className={styles["top-bar-tag"]}>
      <label>Card Title:</label>
      <input value={localShipment.tag}
             onBlur={()=>dispatch(updateShipment(localShipment))}
             onChange={(e)=>setLocalShipment(update<Shipment>(localShipment, "tag", e.target.value))}/>
    </div>
    <div className={styles["top-bar-shippingCompany"]}>
      <label>Shipping Company:</label>
      <input value={localShipment.shippingCompany}
             list={"shippingCompanies"}
             onBlur={()=>dispatch(updateShipment(localShipment))}
             onChange={(e)=>setLocalShipment(update<Shipment>(localShipment, "shippingCompany", e.target.value))}/>
      <datalist id="shippingCompanies">{shippingCompanyList}</datalist>
    </div>
    <div className={styles["top-bar-shipRef"]}>
      <label>Shipping Reference:</label>
      <input value={localShipment.shipRef}
             onBlur={()=>dispatch(updateShipment(localShipment))}
             onChange={(e)=>setLocalShipment(update<Shipment>(localShipment,"shipRef",e.target.value))}/>
    </div>
    <div className={styles["top-bar-exchangeRate"]}>
      <label>Exchange Rate:</label>
      <RegexInput value={localShipment.exchangeRate}
                  type={"decimal"} 
                  handler={(value)=>dispatch(updateShipment(update(localShipment, "exchangeRate", Number(value))))} errorMessage={"Numbers only."}/>
    </div>
    <div className={styles["top-bar-due"]}>
      <label>Due:</label>
      <input value={localShipment.due.split("T")[0]}
             type={"date"}
             onBlur={()=>dispatch(updateShipment(localShipment))}
             onChange={(e)=>setLocalShipment(update<Shipment>(localShipment,"due",new Date(e.target.value).toISOString()))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Booked:</label>
      <input checked={localShipment.booked}
             type={"checkbox"}
             onChange={(e)=>setLocalShipment(update<Shipment>(localShipment,"booked",e.target.checked))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Confirmed:</label>
      <input checked={localShipment.confirmed}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(localShipment,"confirmed",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>At Sea:</label>
      <input checked={localShipment.atSea}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(localShipment,"atSea",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Delivery Arranged:</label>
      <input checked={localShipment.delivery}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(localShipment,"delivery",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Overdue:</label>
      <input checked={localShipment.overdue}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(localShipment,"overdue",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Ready:</label>
      <input checked={localShipment.ready}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(localShipment,"ready",e.target.checked)))}/>
    </div>
    <div className={styles["top-bar-checkbox"]}>
      <label>Delivered:</label>
      <input checked={localShipment.delivered}
             type={"checkbox"}
             onChange={(e)=>dispatch(updateShipment(update<Shipment>(localShipment,"delivered",e.target.checked)))}/>
    </div>
  </div>
}