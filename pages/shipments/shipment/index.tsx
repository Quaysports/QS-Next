import TopBar from './top-bar';
import styles from '../shipment.module.css';
import Details from "./details";
import Finance from "./finance";
import Shipping from "./shipping";
import Summary from "./summary";

export default function ShipmentPage() {
  return <div className={styles["shipment-table"]}>
    <TopBar />
    <div className={styles["sub-table-wrapper"]}>
      <Details />
      <Finance />
      <Shipping />
      <div></div>
      <Summary />
      <div></div>
    </div>
  </div>
}