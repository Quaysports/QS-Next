import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import TagsCheckboxList from "../../../../components/item-database-utils/tags-popup";
import {useDispatch, useSelector} from "react-redux";
import {getNewItemAllTags, selectItem, setNewItemTags} from "../../../../store/item-database/new-items-slice";

type Props = {
    index:number
}
export default function TagsPopup({index}:Props){

    const allTags = useSelector(getNewItemAllTags)
    const item = useSelector(selectItem(index))
    const dispatch = useDispatch()

    function tagHandler(index:number, tags:string[]){
        dispatch(setNewItemTags({index:index, tags:tags}))
    }
    if(!item) return null
    return (
        <button role={'tags-button'} onClick={() => dispatchNotification({type:'popup', content:<TagsCheckboxList itemTags={item.tags} tags={allTags} handler={(x) => tagHandler(index, x)}/>, title:'Tags'})}>{item.tags.length} Tags</button>
    )
}