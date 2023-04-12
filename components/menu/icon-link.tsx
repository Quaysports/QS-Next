import Link from "next/link";
import Image from "next/image";
import styles from "../../pages/dashboard/dashboard.module.css";

export const iconsData = [
  {
    href: "/shop-orders?tab=orders",
    imgSrc: "/shop-orders.svg",
    imgAlt: "icon of shopping trolley",
    title: "Shop Orders",
    width: 50,
    height: 49,
  },
  {
    href: "/shop-tills?tab=pick-list",
    imgSrc: "/shop-till.svg",
    imgAlt: "icon of till",
    title: "Shop Tills",
    width: 50,
    height: 45,
  },
  {
    href: "/reports?tab=incorrect-stock",
    imgSrc: "/reports.svg",
    imgAlt: "icon of reports",
    title: "Reports",
    width: 50,
    height: 50,
  },
  {
    href: "/item-database",
    imgSrc: "/database.svg",
    imgAlt: "icon of database",
    title: "Item DB",
    width: 50,
    height: 50,
  },
  {
    href: "/stock-forecast",
    imgSrc: "/stock-forecast.svg",
    imgAlt: "icon of stock chart",
    title: "Stock Forecast",
    width: 50,
    height: 50,
  },
  {
    href: "/shipments",
    imgSrc: "/shipment.svg",
    imgAlt: "icon of ship",
    title: "Shipments",
    width: 50,
    height: 50,
  },
  {
    href: "/margin-calculator",
    imgSrc: "/calculator.svg",
    imgAlt: "icon of calculator",
    title: "Margin Calc",
    width: 50,
    height: 50,
  },
  {
    href: "/stock-transfer",
    imgSrc: "/stock-transfer.svg",
    imgAlt: "icon of ship",
    title: "Stock Transfer",
    width: 50,
    height: 50,
  },
  {
    href: "/giftcard",
    imgSrc: "/giftcards.svg",
    imgAlt: "icon of giftcards",
    title: "Giftcards",
    width: 50,
    height: 50,
  },
];

export interface iconAttributes {
  href: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  width: number;
  height: number;
}

export const IconLink = ({
  href,
  imgSrc,
  imgAlt,
  title,
  width,
  height,
}: iconAttributes) => {
  return (
    <Link href={href} className={styles["link"]}>
      <div className={styles["iconDisplay"]}>
        <Image src={imgSrc} alt={imgAlt} width={width} height={height} />
        <p>{title}</p>
      </div>
    </Link>
  );
};
