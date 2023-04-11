import styles from "./dashboard.module.css";
import { useRouter } from "next/router";
import UserTab from "./user";
import HomeTab from "./home";
import Menu from "../../components/menu/menu";
import DashboardTabs from "./tabs";
import OneColumn from "../../components/layouts/one-column";
import { appWrapper } from "../../store/store";
import { setAllUserData } from "../../store/dashboard/users-slice";
import {
  getHolidayCalendar,
  getHolidayYearsForLocation,
  getUsers,
  getUserSettings,
  getUsersHoliday,
} from "../../server-modules/users/user";
import HolidayTab from "./holiday";
import {
  setAvailableCalendarsYears,
  setHolidayCalendar,
  setHolidayUsers,
} from "../../store/dashboard/holiday-slice";
import { updateSettings } from "../../store/session-slice";
import { getSession } from "next-auth/react";
import {
  getPublishedRotas,
  getRotaNames,
  getRotaTemplates,
} from "../../server-modules/rotas/rotas";
import {
  setPublishedRotas,
  setTemplatesNames,
  setUserData,
} from "../../store/dashboard/rotas-slice";
import RotasTab from "./rotas";
import Link from "next/link";
import Image from "next/image";

/**
 * Dashboard landing page
 */
export default function Dashboard() {
  const router = useRouter();

  return (
    <OneColumn>
      <Menu>
        <DashboardTabs />
      </Menu>
      {router.query.tab === undefined || router.query.tab === "home" ? (
        <HomeTab />
      ) : null}
      {router.query.tab === "user" ? <UserTab /> : null}
      {router.query.tab === "rotas" ? <RotasTab /> : null}
      {router.query.tab === "holidays" ? <HolidayTab /> : null}
      <div className={styles["container"]}>
        <Link href={"./shop-orders?tab=orders"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/shop-orders.svg"}
              width={50}
              height={49}
              alt={"icon of shopping trolley"}
            />
            <p>Shop Orders</p>
          </div>
        </Link>
        <Link href={"./shop-tills?tab=pick-list"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/shop-till.svg"}
              width={50}
              height={45}
              alt={"icon of till"}
            />
            <p>Shop Tills</p>
          </div>
        </Link>
        <Link href={"/reports?tab=incorrect-stock"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            {" "}
            <Image
              src={"/reports.svg"}
              width={50}
              height={50}
              alt={"icon of till"}
            />
            <p>Reports</p>
          </div>
        </Link>
        <Link href={"/item-database"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/database.svg"}
              width={50}
              height={50}
              alt={"icon of database"}
            />
            <p>Item DB</p>
          </div>
        </Link>
        <Link href={"/stock-forecast"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/stock-forecast.svg"}
              width={50}
              height={50}
              alt={"icon of stock chart"}
            />
            <p>Stock Forecast</p>
          </div>
        </Link>

        <Link href={"/shipments"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/shipment.svg"}
              width={50}
              height={50}
              alt={"icon of ship"}
            />
            <p>Shipments</p>
          </div>
        </Link>
        <Link href={"/margin-calculator"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/calculator.svg"}
              width={50}
              height={50}
              alt={"icon of calculator"}
            />
            <p>Margin Calc</p>
          </div>{" "}
        </Link>
        <Link href={"/stock-transfer"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/stock-transfer.svg"}
              width={50}
              height={50}
              alt={"icon of ship"}
            />
            <p>Stock Transfer</p>
          </div>
        </Link>
        <Link href={"/giftcard"} className={styles["link"]}>
          <div className={styles["iconDisplay"]}>
            <Image
              src={"/giftcards.svg"}
              width={50}
              height={50}
              alt={"icon of ship"}
            />
            <p>Giftcards</p>
          </div>
        </Link>
      </div>
    </OneColumn>
  );
}

export const getServerSideProps = appWrapper.getServerSideProps(
  (store) => async (context) => {
    const session = await getSession(context);
    const user = await getUserSettings(session?.user.username);
    if (user?.settings) store.dispatch(updateSettings(user!.settings));

    if (context.query.tab === "user") {
      const data = await getUsers();
      if (data) store.dispatch(setAllUserData(data));
    }

    if (context.query.tab === "rotas") {
      const location = (context.query.location as string) ?? "online";
      const users = await getRotaNames(location);
      if (users)
        store.dispatch(setUserData({ location: location, users: users }));

      const locationTemplates = await getRotaTemplates(location);
      if (locationTemplates)
        store.dispatch(setTemplatesNames(locationTemplates));

      let currentYear = new Date().getFullYear();
      const data = await getHolidayCalendar({
        year: currentYear,
        location: location,
      });
      if (data) store.dispatch(setHolidayCalendar(data));

      let oneWeekAgo = new Date(new Date().getTime() - 604800000).toISOString();

      const publishedRotas = await getPublishedRotas(location, oneWeekAgo);
      if (publishedRotas) store.dispatch(setPublishedRotas(publishedRotas));
    }

    if (context.query.tab === "holidays") {
      const location = context.query.location
        ? (context.query.location as string)
        : user?.settings?.dashboard?.holiday.location
        ? user?.settings?.dashboard?.holiday.location
        : "shop";

      let currentYear = new Date().getFullYear();
      const years = await getHolidayYearsForLocation(location);
      const year = context.query.year
        ? Number(context.query.year)
        : years.indexOf(currentYear) !== -1
        ? currentYear
        : years[0];
      store.dispatch(setAvailableCalendarsYears(years));

      const data = await getHolidayCalendar({ year: year, location: location });
      if (data) store.dispatch(setHolidayCalendar(data));

      const users = await getUsersHoliday();
      console.dir(users);
      if (users) store.dispatch(setHolidayUsers(users));
    }
    return { props: {} };
  }
);
