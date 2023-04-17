import { useDispatch, useSelector } from "react-redux";
import {
  addItemToShipmentData,
  deleteItemKey,
  selectItemKeys,
} from "../../../store/shipments-slice";
import styles from "../shipment.module.css";
import { ShipmentItem } from "../../../server-modules/shipping/shipping";
import { dispatchNotification } from "../../../components/notification/dispatch-notification";
import { useState } from "react";
export default function ImportItemPopup() {
  const [userInput, setUserInput] = useState("");
  let items = useSelector(selectItemKeys);
  const dispatch = useDispatch();

  if (!items) return null;

  const handler = (item: ShipmentItem) => {
    dispatchNotification();
    dispatch(
      addItemToShipmentData({
        ...item,
        billDesc: item.billDesc,
        dollarTotal: 0,
        dutyPer: item.dutyPer,
        dutyValue: 0,
        fobDollar: item.fobDollar,
        fobPound: 0,
        height: item.height,
        hscode: item.hscode,
        length: item.length,
        m3perBox: 0,
        m3total: 0,
        numOfBoxes: 0,
        orderid: "",
        perOfOrder: 0,
        poundTotal: 0,
        qty: item.qty,
        qtyPerBox: item.qtyPerBox,
        supplier: item.supplier,
        totalPerItem: 0,
        width: item.width,
      })
    );
  };

  const deleteHandler = (item: ShipmentItem) => {
    dispatch(deleteItemKey(item));
    dispatchNotification({
      type: "popup",
      title: "Import Item",
      content: <ImportItemPopup />,
    });
  };

  const filteredItems = items.filter((item) =>
    item.sku.toUpperCase().includes(userInput.toUpperCase())
  );

  if (userInput) {
    items = filteredItems;
  }

  let elements = [];
  for (const [k, item] of Object.entries(items)) {
    elements.push(
      <div key={k} className={styles["import-popup-row"]}>
        <div>
          <button
            onClick={() =>
              dispatchNotification({
                type: "confirm",
                title: "Delete Item",
                content: `Are you sure you want to delete ${item.sku} - ${item.code}?`,
                fn: () => deleteHandler(item),
              })
            }
          >
            X
          </button>
        </div>
        <div>
          <button onClick={() => handler(item)}>Import</button>
        </div>
        <div>{item.sku}</div>
        <div>{item.code}</div>
        <div>{item.desc}</div>
      </div>
    );
  }

  const handleUserInput = (e: string) => {
    setUserInput(e);
  };
  return (
    <div className={styles["import-popup-wrapper"]}>
      <div className={styles["import-popup-row"]}>
        <div></div>
        <div></div>
        <div>SKU</div>
        <div>Code</div>
        <div>Description</div>
      </div>
      <div className={styles["input-bar-and-button"]}>
        <input
          value={userInput}
          placeholder="Search product SKU..."
          onChange={(e) => handleUserInput(e.target.value)}
        />
        {userInput ? (
          <button onClick={() => setUserInput("")}>Back</button>
        ) : null}
      </div>

      {elements}
    </div>
  );
}
