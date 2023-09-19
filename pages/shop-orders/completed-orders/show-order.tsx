import React from 'react';
import styles from '../shop-orders.module.css';
import { useSelector } from 'react-redux';
import { selectOrderContents } from '../../../store/shop-orders-slice';

interface OrderItem {
  quantity: number;
  tradePack?: number;
  SKU: string;
  title: string;
}

export default function ShowOrder() {
  const orderContents = useSelector(selectOrderContents);

  if (orderContents) {
    const tempArray: JSX.Element[] = [];
    orderContents.arrived.forEach((item: OrderItem, index: number) => {
      tempArray.push(
        <div
          key={index}
          className={`${styles['shop-orders-table']} ${styles['shop-orders-table-cells']} ${styles['completed-orders-list-grid']}`}
        >
          <span className={'center-align'}>{item.quantity * (item.tradePack ? item.tradePack : 1)}</span>
          <span>{item.tradePack === null || item.tradePack === undefined || item.tradePack === 1 ? 'N/a' : item.tradePack}</span>
          <span>{item.SKU}</span>
          <span>{item.title}</span>
        </div>
      );
    });

    return (
      <div className={styles['shop-orders-table-containers']}>
        {orderContents.completedBy !== 'unknown' && (
          <div className={styles['shop-orders-table-completed-by']}>{`Completed by: ${orderContents.completedBy}`}</div>
        )}
        <div className={`${styles['shop-orders-table']} ${styles['completed-orders-list-grid']}`}>
          <span className={'center-align'}>Amount</span>
          <span>T/P</span>
          <span>SKU</span>
          <span>Title</span>
        </div>
        {tempArray}
      </div>
    );
  } else {
    return null;
  }
}
