import {
    Fees,
    MarginItem,
    selectAmazonMarginTest,
    selectFees,
    setMarginTest
} from "../../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";

export default function MarginTestResults({item}:{item:MarginItem}){

    const fees = useSelector(selectFees)
    const testValue = useSelector(selectAmazonMarginTest)
    const {testPrice, testMargin} = generateTestValues(item, testValue, fees)

    return <>
            <div>{testPrice}</div>
            <div>{testMargin}</div>
        </>
}

export function MarginTestTitle(){
    const dispatch = useDispatch()

    return <>
        <div>
            <input
                type="number"
                placeholder={"Target %..."}
                onChange={e => dispatch(setMarginTest({type:"Amazon",value:Number(e.target.value)}))}/>
        </div>
        <div>
            Result
        </div>
    </>
}

function generateTestValues(item: MarginItem, testValue: number | null, fees: Fees | null) {

    if (!fees || !testValue) return {testPrice: undefined, testMargin: undefined}

    let amazonFlat = item.PURCHASEPRICE
        + item.MD.POSTALPRICEUK!
        + item.MD.PACKAGING!
        + parseFloat(fees["FLAT"]["AMAZ"])
        + parseFloat(fees["SUBSCRIPTION"]["AMAZ"])

    let targetMargin = ((item.PURCHASEPRICE / 100) * testValue)
    let adjustedPrice = (amazonFlat + targetMargin) / 0.67833

    return {
        testPrice: `£${adjustedPrice.toFixed(2)}`,
        testMargin: `£${targetMargin.toFixed(2)} | ${testValue.toFixed(0)}%`
    }
}