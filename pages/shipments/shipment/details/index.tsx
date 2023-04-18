import { useDispatch, useSelector } from "react-redux";
import {
  deleteShipmentData,
  selectActiveShipmentIndex,
  selectShipment,
  selectSkuKeys,
  setActiveShipmentIndex,
  updateShipment,
} from "../../../../store/shipments-slice";
import styles from "../../shipment.module.css";
import { useEffect, useState } from "react";
import {
  Shipment,
  ShipmentItem,
} from "../../../../server-modules/shipping/shipping";
import RegexInput from "../../../../components/regex-input";

export default function Details() {
  const shipment = useSelector(selectShipment);

  if (!shipment) return null;

  let elements = [<TitleRow key={"title"} />];
  for (let i in shipment.data) {
    elements.push(
      <ItemRow key={i} shipmentItem={shipment.data[i]} index={i} />
    );
  }

  return <div className={styles["shipment-sub-table"]}>{elements}</div>;
}

function TitleRow() {
  return (
    <div className={`${styles["details-item-row"]} ${styles["title-row"]}`}>
      <div>Del</div>
      <div>Code</div>
      <div>SKU</div>
      <div>Supplier</div>
      <div>Order ID</div>
      <div>Description</div>
      <div>HS Code</div>
      <div>Bill of Landing Description</div>
      <div>Qty Required</div>
    </div>
  );
}

interface ItemRowProps {
  shipmentItem: ShipmentItem;
  index: string;
}
function ItemRow({ shipmentItem, index }: ItemRowProps) {
  const skuKeys = useSelector(selectSkuKeys);
  const shipment = useSelector(selectShipment);
  const [item, setItem] = useState<ShipmentItem>(shipmentItem);
  const dispatch = useDispatch();
  const activeIndex = useSelector(selectActiveShipmentIndex);

  useEffect(() => setItem(shipmentItem), [shipmentItem]);

  if (!shipmentItem || !shipment) return null;

  let skuList = [];
  if (skuKeys) {
    for (let key of skuKeys)
      skuList.push(<option key={key} value={key}></option>);
  }
  function update<T>(obj: T, key: keyof T, value: T[keyof T]) {
    let update = structuredClone(obj);
    update[key] = value;
    return update;
  }

  function updateShipmentSlice(shipment: Shipment, newItem: ShipmentItem) {
    const newShipment = structuredClone(shipment);
    newShipment.data[Number(index)] = newItem;
    dispatch(updateShipment(newShipment));
  }

  return (
    <div
      className={`${styles["details-item-row"]} ${
        index === activeIndex ? styles["highlighted"] : ""
      }`}
      onClick={() => dispatch(setActiveShipmentIndex(index))}
    >
      <div>
        <button onClick={() => dispatch(deleteShipmentData(Number(index)))}>
          X
        </button>
      </div>
      <div>
        <input
          value={item.code}
          onBlur={() => updateShipmentSlice(shipment, item)}
          onChange={(e) =>
            setItem(update<ShipmentItem>(item, "code", e.target.value))
          }
        />
      </div>
      <div>{item.sku}</div>
      <div>
        <input
          value={item.supplier}
          onBlur={() => updateShipmentSlice(shipment, item)}
          onChange={(e) =>
            setItem(update<ShipmentItem>(item, "supplier", e.target.value))
          }
        />
      </div>
      <div>
        <input
          value={item.orderid}
          onBlur={() => updateShipmentSlice(shipment, item)}
          onChange={(e) =>
            setItem(update<ShipmentItem>(item, "orderid", e.target.value))
          }
        />
      </div>
      <div>
        <input
          value={item.desc}
          onBlur={() => updateShipmentSlice(shipment, item)}
          onChange={(e) =>
            setItem(update<ShipmentItem>(item, "desc", e.target.value))
          }
        />
      </div>
      <div>
        <input
          value={item.hscode}
          onBlur={() => updateShipmentSlice(shipment, item)}
          onChange={(e) =>
            setItem(update<ShipmentItem>(item, "hscode", e.target.value))
          }
        />
      </div>
      <div>
        <input
          value={item.billDesc}
          onBlur={() => updateShipmentSlice(shipment, item)}
          onChange={(e) =>
            setItem(update<ShipmentItem>(item, "billDesc", e.target.value))
          }
        />
      </div>
      <div>
        <RegexInput
          type={"number"}
          value={item.qty}
          errorMessage={"Numbers only"}
          handler={(value) => {
            setItem(update<ShipmentItem>(item, "qty", value));
            updateShipmentSlice(
              shipment,
              update<ShipmentItem>(item, "qty", value)
            );
          }}
        />
      </div>
    </div>
  );
}
