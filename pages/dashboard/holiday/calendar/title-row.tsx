import styles from "./calendar.module.css";

interface Props {
    year: number;
    maxDays: number
}

export default function TitleRow({year, maxDays}: Props){
    let elements = [<div key={"year"} className={styles.title}>{year}</div>]

    for(let i = 0; i < maxDays; i++){
        elements.push(<TitleCell key={i} index={i}/>)
    }

    return <div style={{gridTemplateColumns:`repeat(${maxDays + 1}, 1fr)`}} className={styles.row}>{elements}</div>
}

function TitleCell({index}: {index: number}){
    let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
    let loop = Math.floor(index / 7)

    return <div className={styles.title}>{days[index - (loop * 7)]}</div>
}