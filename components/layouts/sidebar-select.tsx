import {ChangeEventHandler, ReactNode, useEffect, useState} from "react";
import styles from './layout-styles.module.css'

interface Props {
    children:ReactNode,
    onChange:ChangeEventHandler<HTMLSelectElement>,
    value?:string,
    role?:string
}

export default function SidebarSelect({children, onChange, value = undefined,  role = undefined}:Props) {

    const [selected, setSelected] = useState(value)

    useEffect(()=>{
        setSelected(value)
    }, [value])

    return(
        <select role={role} className={styles["sidebar-select"]} value={selected} onChange={(e)=>{
            setSelected(e.target.value)
            onChange(e)
        }}>{children}</select>
    )
}