import {useDispatch} from "react-redux";
import {setItemAmazonBulletPoints} from "../../../../store/item-database/item-database-slice";

interface Props {
    index: number
}

export default function BulletPointInput({index}: Props) {

    const dispatch = useDispatch()

    function amazonBulletPointHandler(value: string, index: number) {
        dispatch(setItemAmazonBulletPoints({value: value, index: index}))
    }

    return (
        <>
            <div>{index}:</div>
            <input onChange={(e) => {
                amazonBulletPointHandler(e.target.value, index)
            }}/>
        </>
    )
}