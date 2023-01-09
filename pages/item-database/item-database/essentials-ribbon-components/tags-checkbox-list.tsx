import {useDispatch, useSelector} from "react-redux";
import {selectItem, selectTags, setItemTags} from "../../../../store/item-database/item-database-slice";
import styles from "../../item-database.module.css"

export default function TagsCheckboxList(){

    const tags = useSelector(selectTags)
    const item = useSelector(selectItem)
    const dispatch = useDispatch()


    function checklist(tags:string[], item:schema.Item){
        let itemTags: string[] = !item.tags ? [] : item.tags
        let tagsCheckListArray:JSX.Element[] = []

        const checkboxCheck = (itemTags:string[], tag: string) => {
            for(const itemTag of itemTags){
                if (itemTag === tag){
                    return true
                }
            }
        }
        const tagUpdateHandler = (checked: boolean, tag:string) => {
            dispatch(setItemTags({checked:checked, tag:tag}))
        }

        for(let tag of tags){
            tagsCheckListArray.push(<span key={tag}><input key={tag} type={"checkbox"} onChange={(e) => tagUpdateHandler(e.target.checked, tag)} defaultChecked={checkboxCheck(itemTags, tag)}/><label>{tag}</label></span>)
        }
        return tagsCheckListArray
    }

    return (
        <div className={styles["tags-container"]}>
            {checklist(tags, item)}
        </div>
    )
}