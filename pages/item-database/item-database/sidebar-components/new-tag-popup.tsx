import {ChangeEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectTags, setUpdateTags} from "../../../../store/item-database/item-database-slice";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";


export default function NewTagPopUp() {

    const [newTag, setNewTag] = useState<string>("")
    const [invalid, setInvalid] = useState<boolean>(false)
    const dispatch = useDispatch()
    const tags = useSelector(selectTags)

    const saveTagHandler = (newTag:string) => {
        let newTagArray = newTag.trim().split("")
        for(let i = 0; i < newTagArray.length; i++){
            i === 0 ? newTagArray[0] = newTagArray[0].toUpperCase() : newTagArray[i] = newTagArray[i].toLowerCase()
            if(newTagArray[i - 1] === " ") newTagArray[i] = newTagArray[i].toUpperCase()
        }
        let newTagFormatted = newTagArray.toString().replaceAll(",","")
        dispatch(setUpdateTags(newTagFormatted))
        dispatchNotification()
    }

    const setNewTagHandler = (event: ChangeEvent<HTMLInputElement>, tags:string[]) => {
        let isValid = true
        for(const tag of tags){
            if(event.target.value.toLowerCase() === tag.toLowerCase()) isValid = false
        }

        if(!isValid) {
            event.target.setCustomValidity("Tag already exists")
            event.target.reportValidity()
            setInvalid(true)
        } else {
            setInvalid(false)
            event.target.setCustomValidity("")
            setNewTag(event.target.value)
        }
    }

    return (<>
        <input onChange={(e) => setNewTagHandler(e, tags)}/>
        <button className={"button"} disabled={invalid} onClick={() => saveTagHandler(newTag)}>Save</button>
    </>
    )
}