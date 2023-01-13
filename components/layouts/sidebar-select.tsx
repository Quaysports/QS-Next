import {ChangeEventHandler, ReactNode, useState} from "react";
import styles from './layout-styles.module.css'

export default function SidebarSelect({children, value = undefined, onChange}:{children:ReactNode,value?:string, onChange:ChangeEventHandler<HTMLSelectElement>}) {

    const [selected, setSelected] = useState(value)

    return(
        <select className={styles["sidebar-select"]} value={selected} onChange={(e)=>{
            setSelected(e.target.value)
            onChange(e)
        }}>{children}</select>
    )
}