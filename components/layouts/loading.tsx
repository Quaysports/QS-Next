import style from "./layout-styles.module.css";

export default function LoadingDiv(){
    return <div className="loading-div">
        <div className={style.spinner}>
            <div className={style["spinner-inner"]}></div>
        </div>
    </div>
}