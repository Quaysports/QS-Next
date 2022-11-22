import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemStatusBoxes} from "../../../../store/item-database/item-database-slice";

interface Props {
    title: string
}
export default function StatusCheckboxes({title}:Props){

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function statusCheckBoxHandler(checked: boolean, title:string){
        dispatch(setItemStatusBoxes({checked:checked, title:title as keyof sbt.statusChecks["DONE"]}))
    }

    return (
        <div><input checked={item?.CHECK?.DONE[title as keyof sbt.statusChecks["DONE"]]}
               type={"checkbox"}
                    onChange={(e) => statusCheckBoxHandler(e.target.checked, title)}/></div>
    )
}