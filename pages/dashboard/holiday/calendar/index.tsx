import { useSelector } from "react-redux";
import { selectCalendar } from "../../../../store/dashboard/holiday-slice";
import styles from "./calendar.module.css";
import TitleRow from "./title-row";
import MonthRow from "./month-row";
export default function Calendar() {
  const calendar = useSelector(selectCalendar)

  if (!calendar) return null

  const maxDays = calendar.maxDays

  let elements = [<TitleRow key={"title-row"} maxDays={maxDays} year={calendar.year}/>]

  for (const month of calendar.template) {
      elements.push(<MonthRow key={month.text}
                              month={month}
                              maxDays={maxDays}/>)
  }

  return <div className={styles.calendar}>{elements}</div>
}