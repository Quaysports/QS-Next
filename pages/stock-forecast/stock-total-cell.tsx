import styles from './stock-forecast.module.css'
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {StockForecastItem} from "./index";

interface Props {
    item: StockForecastItem
}

export default function StockTotalCell({item}: Props) {

    if (!item) return null

    function createContent(item: StockForecastItem) {

        const {historicConsumption, historicOutOfStock, oneMonthOutOfStock, fourMonthOutOfStock} = item.stockConsumption

        function toLocalDate(ms: number) {
            return new Date(ms).toLocaleDateString("en-GB")
        }

        return <div className={styles["forecast-popup"]}>
            {historicOutOfStock > 0 ?
                <div>Historic: <strong>{toLocalDate(historicOutOfStock)}</strong></div> : null}
            {fourMonthOutOfStock > 0 ?
                <div>Four Month: <strong>{toLocalDate(fourMonthOutOfStock)}</strong></div> : null}
            {oneMonthOutOfStock > 0 ?
                <div>One Month: <strong>{toLocalDate(oneMonthOutOfStock)}</strong></div> : null}
            {historicConsumption.length > 0 ? consumptionTable(historicConsumption) : null}
        </div>
    }

    return <div
        className={styles["details-cell"]}
        onMouseOver={(e) => {
            dispatchNotification({
                type: "tooltip",
                e: e,
                title: "Out of Stock Estimates",
                content: createContent(item)
            })
        }}
        onMouseLeave={() => dispatchNotification()}
    >{item.stock.total}</div>
}

function consumptionTable(historicConsumption: number[]){
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let elements = []

    let min = Math.min(...historicConsumption)
    let max = Math.max(...historicConsumption)

    const color1 = {red: 50, green: 164, blue: 49};
    const color2 = {red: 247, green: 181, blue: 0};
    const color3 = {red: 255, green:0, blue: 0};

    for(let i = 0; i < historicConsumption.length; i++){

        let fade = (historicConsumption[i] - min) / (max - min)

        elements.push(<div className={styles["consumption-row"]} key={i}><div>{months[i]}</div><div style={{color:colorGradient(fade, color1, color2, color3)}} >{historicConsumption[i]}</div></div>)
    }
    return <div className={styles["consumption-table"]}><div>Consumption:</div>{elements}</div>
}

interface Color {
    red: number
    green: number
    blue: number
}
function colorGradient(fadeFraction:number, rgbColor1:Color, rgbColor2:Color, rgbColor3:Color) {

    let color1 = rgbColor1;
    let color2 = rgbColor2;
    let fade = fadeFraction;

    // Do we have 3 colors for the gradient? Need to adjust the params.
    if (rgbColor3) {
        fade = fade * 2;
        // Find which interval to use and adjust the fade percentage
        if (fade >= 1) {
            fade -= 1;
            color1 = rgbColor2;
            color2 = rgbColor3;
        }
    }

    let diffRed = color2.red - color1.red;
    let diffGreen = color2.green - color1.green;
    let diffBlue = color2.blue - color1.blue;

    let gradient = {
        red: Math.floor(color1.red + (diffRed * fade)),
        green: Math.floor(color1.green + (diffGreen * fade)),
        blue: Math.floor(color1.blue + (diffBlue * fade))
    };
    return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
}