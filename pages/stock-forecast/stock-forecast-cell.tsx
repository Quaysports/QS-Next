interface Props {
    style:string
}
export default function StockForecastCell({style}:Props){
    return(
        <div style={{background:style}}></div>
    )
}