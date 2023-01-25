import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemAmazonBulletPoints} from "../../../../store/item-database/item-database-slice";
import {schema} from "../../../../types";

interface Props {
    index: number
}

export default function BulletPointInput({index}: Props) {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    let bulletPoint = "bulletPoint" + index as keyof schema.MappedExtendedProperties

    function amazonBulletPointHandler(value: string, index: number) {
        dispatch(setItemAmazonBulletPoints({value: value, index: index}))
    }

    return (
        <>
            <div>{index}:</div>
            <input onBlur={(e) => {
                amazonBulletPointHandler(e.target.value, index)
            }} defaultValue={item.mappedExtendedProperties[bulletPoint] ?  item.mappedExtendedProperties[bulletPoint] : ""}/>
        </>
    )
}