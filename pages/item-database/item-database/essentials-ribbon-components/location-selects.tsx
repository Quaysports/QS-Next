import {selectItem, setItem, setItemLocation} from "../../../../store/item-database/item-database-slice";
import {useDispatch, useSelector} from "react-redux";

export default function itemLocation() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function locationHandler(value:string, key:keyof sbt.shelfLocation) {
        dispatch(setItemLocation({value: value, key:key}))
    }

    function prefixOptions(){
        return [<>
            <option/>
            <option>R</option>
            <option>S</option>
        </>]
    }

    function letterOptions(){
        let alphabetArray = [<option key={"letters null"}/>]
        for(let i = 0; i < 26; i++){
            alphabetArray.push(<option key={"letters " + i}>{String.fromCharCode((65+i))}</option>)
        }
        return alphabetArray
    }

    function numberOptions(){
        let numberArray = [<option key={"numbers null"}/>]
        for(let i = 0; i < 100; i++){
            numberArray.push(<option key={"numbers " + i}>{i}</option>)
        }
        return numberArray
    }
    return (
        <>
            <select value={item?.SHELFLOCATION?.PREFIX}
                    onChange={(e) => locationHandler(e.target.value, "PREFIX")}>
                {prefixOptions()}
            </select>
            <select value={item?.SHELFLOCATION?.LETTER}
                    onChange={(e) => locationHandler(e.target.value, "LETTER")}>
                {letterOptions()}
            </select>
            <select value={item?.SHELFLOCATION?.NUMBER}
                    onChange={(e) => locationHandler(e.target.value, "NUMBER")}>
                {numberOptions()}
            </select>
        </>
    )
}