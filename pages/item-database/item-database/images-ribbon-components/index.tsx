import ImageContainer from "./image-container";
import styles from "../../item-database.module.css"

export default function ImagesRibbon(){
    return (
        <div className={styles["image-container"]}>
            <ImageContainer imageTag={"Main"}/>
            <ImageContainer imageTag={"1"}/>
            <ImageContainer imageTag={"2"}/>
            <ImageContainer imageTag={"3"}/>
            <ImageContainer imageTag={"4"}/>
            <ImageContainer imageTag={"5"}/>
            <ImageContainer imageTag={"6"}/>
            <ImageContainer imageTag={"7"}/>
            <ImageContainer imageTag={"8"}/>
            <ImageContainer imageTag={"9"}/>
            <ImageContainer imageTag={"10"}/>
            <ImageContainer imageTag={"11"}/>
        </div>

    )
}