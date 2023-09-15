import { useSelector } from "react-redux";
import { selectCalendar } from "../../../../store/dashboard/holiday-slice";
import styles from "./calendar.module.css";
import TitleRow from "./title-row";
import MonthRow from "./month-row";
import { useEffect, useState } from "react";
import { schema } from "../../../../types";
export default function Calendar() {
  const calendar = useSelector(selectCalendar);

  if (!calendar) return null

  const maxDays = calendar.maxDays;

  const [mergedCalendar, setMergedCalendar] = useState<schema.HolidayCalendar[]>([]);

  useEffect(() => {    
    // Assuming calendar[0] is the "shop" data and calendar[1] is the "online" data
    if (Array.isArray(calendar)) {
        const shopTemplates = calendar[0].template;
        const onlineTemplates = calendar[1].template;
    
        // Merge the 'booked' days within each month's 'days' array
        const mergedTemplate = shopTemplates.map((shopMonth: schema.HolidayMonth, index: number) => ({
          ...shopMonth,
          days: shopMonth.days.map((shopDay, dayIndex) => ({
            ...shopDay,
            booked: {
              ...shopDay.booked,
              ...onlineTemplates[index].days[dayIndex].booked,
            },
          })),
        }));
    
        // Create a merged calendar object
        const mergedCalendarData: schema.HolidayCalendar = {
          ...calendar[0], // You can choose which shop or online data to keep here
          template: mergedTemplate,
        };
    
        setMergedCalendar([mergedCalendarData]);
    }
  }, [calendar]);

  let elements = null;
  let test: any = [];

  if (Array.isArray(calendar)) {
    const maxDays = calendar[0].maxDays;
    elements = [
      <TitleRow key={"title-row"} maxDays={maxDays} year={calendar[0].year} />,
    ];
    for(const mergedCalendarData of mergedCalendar) {
      for(const month of mergedCalendarData.template) {
          elements.push(
           <MonthRow key={month.text} month={month} maxDays={maxDays} />
        );
      }
    }

  } else {
    elements = [
      <TitleRow key={"title-row"} maxDays={maxDays} year={calendar.year} />,
    ];
    for (const month of calendar.template) {
      console.log(month);
      elements.push(
        <MonthRow key={month.text} month={month} maxDays={maxDays} />
      );
    }
  }
  console.log("test: ", test);
  return <div className={styles.calendar}>{elements}</div>;
}
