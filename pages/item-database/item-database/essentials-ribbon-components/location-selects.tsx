import {selectItem, setItemLocation} from "../../../../store/item-database/item-database-slice";
import {useDispatch, useSelector} from "react-redux";
import {Fragment} from "react";

export default function ItemLocation() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    function locationHandler(value:string, key:keyof sbt.shelfLocation) {
        dispatch(setItemLocation({value: value, key:key}))
    }

    function prefixOptions(){
        return [<Fragment key={"prefix-fragment"}>
            <option key={"prefix" + 0}/>
            <option key={"prefix" + 1}>S</option>
            <option key={"prefix" + 2}>D</option>
            <option key={"prefix" + 2}>U</option>
        </Fragment>]
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
        <div key={"location-div"}>
            <select key={"select 1"} value={item.SHELFLOCATION.PREFIX}
                    onChange={(e) => locationHandler(e.target.value, "PREFIX")}>
                {prefixOptions()}
            </select>
            <select key={"select 2"} value={item.SHELFLOCATION.LETTER}
                    onChange={(e) => locationHandler(e.target.value, "LETTER")}>
                {letterOptions()}
            </select>
            <select key={"select 3"} value={item.SHELFLOCATION.NUMBER}
                    onChange={(e) => locationHandler(e.target.value, "NUMBER")}>
                {numberOptions()}
            </select>
        </div>
    )
}