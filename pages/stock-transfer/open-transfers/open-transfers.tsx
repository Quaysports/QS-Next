import { useDispatch, useSelector } from "react-redux";
import {
  selectOpenTransfer,
  setTransfer,
  saveTransfer,
  removeSKU,
  updateOpenTransfer,
} from "../../../store/stock-transfer-slice";
import styles from "../stock-transfer.module.css";
import { dispatchNotification } from "../../../components/notification/dispatch-notification";
import ColumnLayout from "../../../components/layouts/column-layout";
import { useState } from "react";

export default function OpenTransfers() {
  const openTransfer = useSelector(selectOpenTransfer);
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState("sort by");
  const [orderBy, setOrderBy] = useState("order by");

  function orderByPropertyAndDirection<T>(
    a: T,
    b: T,
    property: keyof T | string,
    direction: string
  ) {
    const getValue = (obj: T, prop: keyof T | string): any => {
      const props = typeof prop === "string" ? prop.split(".") : [prop];
      let value: any = obj;
      for (const prop of props) {
        value = value[prop];
      }
      return value;
    };

    const valueA = getValue(a, property);
    const valueB = getValue(b, property);

    if (direction === "asc") {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else if (direction === "desc") {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }

    return 0;
  }

  const handleSortButtonClick = (property: any) => {
    const sortedItems = openTransfer.items
      .slice()
      .sort((a, b) => orderByPropertyAndDirection(a, b, property, orderBy));
    dispatch(updateOpenTransfer(sortedItems));
  };

  function transferHandler(index: number, amount: string) {
    dispatch(setTransfer({ index: index, amount: parseInt(amount) || 0 }));
  }

  function saveHandler() {
    dispatch(saveTransfer());
  }

  function removeSkuHandler(index: number, sku: string) {
    dispatchNotification({
      type: "confirm",
      title: "Remove item",
      content: "Are you sure you want to remove " + sku + " from the transfer?",
      fn: () => dispatch(removeSKU(index)),
    });
  }

  if (!openTransfer) return null;

  const OrderByAndSortByDropdowns = () => {
    if (openTransfer.items.length === 0) {
      return null;
    } else {
      return (
        <div className={styles["open-transfer-buttons-container"]}>
          <label htmlFor="sort">
            <select
              name="sort"
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="sort by">Sort by...</option>
              <option value="SKU">SKU</option>
              <option value="title">Title</option>
              <option value="stock.default">Roundswell</option>
              <option value="stock.minimum">Minimum</option>
              <option value="stock.warehouse">Warehouse</option>
              <option value="transfer">Transfer</option>
            </select>
          </label>
          <label htmlFor="order">
            <select
              name="order"
              id="order"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <option value="order by">Order by...</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
          <button onClick={() => handleSortButtonClick(sortBy)}>Sort</button>
        </div>
      );
    }
  };

  return (
    <section>
      <ColumnLayout scroll={true}>
        <OrderByAndSortByDropdowns />
        <div className={styles["open-transfer-container"]}>
          <div className={styles["open-transfer-title"]}>
            <div></div>
            <div>SKU</div>
            <div>Title</div>
            <div>Roundswell</div>
            <div>Minimum</div>
            <div>Warehouse</div>
            <div>Transfer</div>
          </div>
          {openTransfer.items.map((item, index) => {
            return (
              <div key={index} className={styles["open-transfer-row"]}>
                <button
                  className={styles["delete-button"]}
                  onClick={() => {
                    removeSkuHandler(index, item.SKU);
                  }}
                >
                  X
                </button>
                <div>{item.SKU}</div>
                <div>{item.title}</div>
                <span>{item.stock.default}</span>
                <span>{item.stock.minimum}</span>
                <span>{item.stock.warehouse}</span>
                <input
                  value={item.transfer}
                  onBlur={() => {
                    saveHandler();
                  }}
                  onChange={(e) => transferHandler(index, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </ColumnLayout>
    </section>
  );
}
