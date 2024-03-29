import {PublishedRota} from "../../../../server-modules/rotas/rotas";
import styles from "../rotas.module.css";
import {
    editPublishedRota,
    selectPublishedRotas
} from "../../../../store/dashboard/rotas-slice";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import PublishRota from "../publish";
import RotaWeek from "../rota";
import PublishSidebar from "../publish/publish-sidebar";
import {useDispatch, useSelector} from "react-redux";
import InfoPanel from "../info-panel";

export default function PublishedRotaList() {

    const publishedRotas = useSelector(selectPublishedRotas)

    let rotas = []
    for (const template of publishedRotas) {
        rotas.push(<Rota key={template.weekData.week} rota={template}/>)
    }
    return (
        <div className={styles["published-rotas"]}>
            {rotas}
        </div>
    )
}

function Rota({rota}: { rota: PublishedRota }) {
    const dispatch = useDispatch()
    const publishedRotas = useSelector(selectPublishedRotas)

    function getPrintRowData(rota: PublishedRota, publishedRotas: PublishedRota[]) {
        if(!rota) return undefined
        let pos = publishedRotas.findIndex(stateRota => stateRota.weekData.monday === rota.weekData.monday)
        if(pos === -1) return undefined
        return publishedRotas.slice(pos,pos+2)
    }

    async function deleteRota() {
        console.log("delete")
        let opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(rota)
        }
        let result = await fetch("/api/rotas/delete-published", opts)
        console.log(await result)
        window.location.reload()
    }

    return (
        <div key={rota.weekData.week} className={styles["published-container"]}>
            <div className={styles["published-info"]}>
                <div className={styles["published-info-buttons"]}>
                    <button onClick={() => {
                        dispatch(editPublishedRota(rota))
                        dispatchNotification({type: "popup", title: "Publish Rota", content: <PublishRota/>})
                    }}>Edit</button>
                    <button onClick={() => {
                        dispatchNotification({type:"confirm", title:"Delete Rota", content:"Are you sure you want to delete this rota?", fn:deleteRota})
                    }}>Delete</button>
                    <button onClick={() => {
                        if(!window) return
                        window.open("/print?app=rotas&print=rows", "_blank")
                        window.localStorage.setItem("rota", JSON.stringify(getPrintRowData(rota, publishedRotas)))
                    }}>Print Rows</button>
                    <button onClick={() => {
                        if(!window) return
                        window.open("/print?app=rotas&print=grid", "_blank")
                        window.localStorage.setItem("rota", JSON.stringify(getPrintRowData(rota, publishedRotas)))
                    }}>Print Grid</button>
                </div>
                <div>Week starting {new Date(rota.weekData.monday).toLocaleDateString('en-GB')}</div>
                <div>Week Number: {rota.weekData.week}</div>
            </div>
            <div className={styles["info-panel-rota-sidebar"]} style={{maxHeight:"initial"}}>
                <InfoPanel rota={rota}/>
                <RotaWeek rota={rota} weekData={rota.weekData} holiday={rota.holidays} edit={false}/>
                <PublishSidebar rota={rota} editable={false}/>
            </div>
        </div>
    )
}