interface Props{
    title:JSX.Element[]
}

export default function ReportRibbon({title}:Props){
    return(
        <div>
            {title}
        </div>
    )
}