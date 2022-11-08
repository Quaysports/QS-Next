import styles from "./stock-forecast.module.css";
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {dispatchNotification} from "../../server-modules/dispatch-notification";

interface Props {
    item:StockForecastItem
    index:number
}
export default function StockForecastCell({item, index}:Props){
    return(
        <div
            className={styles["month-cell"]}
            style={{background:item.months[index].style}}
            onMouseOver={(e)=>{
                let startStock = item.months[index].dayBreakdown[0].stock
                let endStock = item.months[index].dayBreakdown[item.months[index].dayBreakdown.length-1]?.stock

                const content = []
                for(let year in item.MONTHSTOCKHIST){
                    if(Number(year) === (new Date()).getFullYear()) continue;
                    content.push(<div key={year}>{year}: {item.MONTHSTOCKHIST[year][item.months[index].month]}</div>)
                }
                content.reverse()
                content.push(<div key={"est"}>Est: {startStock - endStock}</div>)

                dispatchNotification({type:"tooltip",title:"Stock Consumption", content:content,e:e})
            }}
            onMouseLeave={()=>dispatchNotification({type:undefined})}
        >{item.months[index].dayBreakdown[0].stock}</div>
    )
}