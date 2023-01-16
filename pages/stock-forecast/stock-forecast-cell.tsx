import styles from "./stock-forecast.module.css";
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

interface Props {
    item:StockForecastItem
    index:number
}
export default function StockForecastCell({item, index}:Props){

    if(!item) return null

    return(
        <div
            className={styles["month-cell"]}
            style={{background:item.months[index].style}}
            onMouseOver={(e)=>{
                let startStock = item.months[index].dayBreakdown[0].stock
                let endStock = item.months[index].dayBreakdown[item.months[index].dayBreakdown.length-1]?.stock

                const content = []
                for(let year of item.stockHistory){
                    if(Number(year) === (new Date()).getFullYear()) continue;
                    content.push(<div key={year[0]}>{year[0]}: {year[item.months[index].month]}</div>)
                }
                content.reverse()
                content.push(<div key={"est"}>Est: {startStock - endStock}</div>)

                dispatchNotification({type:"tooltip",title:"Stock Consumption", content:content,e:e})
            }}
            onMouseLeave={()=>dispatchNotification()}
        >{item.months[index].dayBreakdown[0].stock}</div>
    )
}