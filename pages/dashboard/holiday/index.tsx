import Calendar from "./calendar";
import ColumnLayout from "../../../components/layouts/column-layout";
import styles from "./holiday.module.css";
import HolidayMenu from "./menu";

export default function HolidayTab(){
    return <ColumnLayout scroll={true}
                         background={false}>
        <div className={styles.wrapper}>
            <div>
                <HolidayMenu/>
            </div>
            <Calendar/>
        </div>
    </ColumnLayout>
}