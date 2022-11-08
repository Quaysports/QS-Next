import {useSelector} from "react-redux";
import {selectSuppliers} from "../../store/stock-forecast-slice";
import styles from "./stock-forecast.module.css"
import React from "react";
import {useRouter} from "next/router";
import {dispatchNotification} from "../../server-modules/dispatch-notification";

export default function SupplierSelect(){
    const suppliers = useSelector(selectSuppliers)
    const router = useRouter()
    let selectedSuppliers = typeof router.query.suppliers  === "string"
        ? [router.query.suppliers]
        : router.query.suppliers

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // @ts-ignore
        const {submitter} = e.nativeEvent;
        if(submitter.value === "Submit") {
            const data = new FormData(e.target as HTMLFormElement)
            const selected = []
            for (let entry of data.keys()) selected.push(entry)
            await router.push({pathname: router.pathname, query: {...router.query, suppliers: selected}})
            dispatchNotification({type: undefined})
        } else {
            if(router.query.suppliers) delete router.query.suppliers
            await router.push({pathname: router.pathname, query: router.query})
            dispatchNotification({type: undefined})
        }
    }

    const elements = []
    for(let supplier of suppliers){
        elements.push(
            <div key={supplier}>
                <input id={`${supplier}-input`} type={"checkbox"} name={supplier} defaultChecked={selectedSuppliers?.includes(supplier)}/>
                <label htmlFor={`${supplier}-input`}>{supplier}</label>
            </div>)

    }

    return <form className={styles.popup} onSubmit={e => handleSubmit(e)}>
        <div className={styles.list}>
            {elements}
        </div>
        <div key={"buttons"} className={styles.buttons}>
            <button key={"supplier-submit"} type="submit" value={"Submit"}>Submit</button>
            <button key={"supplier-reset"} type="submit" value={"Reset"}>Reset</button>
        </div>

    </form>
}