import styles from "./item-database-utils.module.css";
import {useState} from "react";
import {dispatchNotification} from "../notification/dispatch-notification";

type Props = {
    itemTags?: string[]
    tags: string[]
    handler: (x:string[]) => void
}


export default function TagsCheckboxList({itemTags = [], tags, handler}: Props){

    const [tagArray, setTagArray] = useState<string[]>(itemTags)
    function checklist(tags:string[], tagArray:string[]){
        let tagsCheckListArray:JSX.Element[] = []
        const checkboxCheck = (itemTags:string[], tag: string) => {
            for(const itemTag of tagArray){
                if (itemTag === tag){
                    return true
                }
            }
        }
        const tagUpdateHandler = (checked: boolean, tag:string) => {
            const tagsCopy = [...tagArray]
            if(checked){
                tagsCopy.push(tag)
                setTagArray(tagsCopy)
            } else {
                const index = tagsCopy.findIndex(itemTag => itemTag === tag)
                tagsCopy.splice(index, 1)
                setTagArray(tagsCopy)
            }
        }

        for(let tag of tags){
            tagsCheckListArray.push(
                <span key={tag}>
                    <input
                        key={tag}
                        type={"checkbox"}
                        onChange={(e) => tagUpdateHandler(e.target.checked, tag)}
                        defaultChecked={checkboxCheck(itemTags, tag)}/>
                    <label>{tag}</label>
                </span>)
        }
        return tagsCheckListArray
    }

    function onClickHandler(tagsArray: string[]){
        handler(tagsArray)
        dispatchNotification()
    }

    return (
        <>
        <div className={styles["tags-container"]}>
            {checklist(tags, tagArray)}
        </div>
            <button className={styles["tags-button"]} onClick={() => {onClickHandler(tagArray)}}>Ok</button>
        </>
    )
}