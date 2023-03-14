import {useDispatch, useSelector} from "react-redux";
import {selectItem, setNewItemTitle} from "../../../../store/item-database/new-items-slice";

type Props = {
    index:number
}
export default function TitleInput({index}: Props){

    const dispatch = useDispatch()
    const item = useSelector(selectItem(index))
    function titleHandler(index:number, title:string){
        dispatch(setNewItemTitle({index:index, title:title}))
    }
    if(!item) return null
    return (
        <input value={item.title} onChange={(e) => {titleHandler(index, e.target.value)}}/>
    )
}