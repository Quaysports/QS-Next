import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemAmazonBulletPoints} from "../../../../store/item-database/item-database-slice";

interface Props {
    index: number
}

export default function BulletPointInput({index}: Props) {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    let bulletPoint = "BULLETPOINT" + index as keyof sbt.itemDatabaseExtendedProperties

    function amazonBulletPointHandler(value: string, index: number) {
        dispatch(setItemAmazonBulletPoints({value: value, index: index}))
    }

    return (
        <>
            <div>{index}:</div>
            <input onChange={(e) => {
                amazonBulletPointHandler(e.target.value, index)
            }} value={item.IDBEP[bulletPoint] ?  item.IDBEP[bulletPoint] : ""}/>
        </>
    )
}