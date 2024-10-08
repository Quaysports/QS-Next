import {
    MarginItem,
    selectOnbuyMarginTest,
    selectFees,
    setMarginTest
} from "../../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";
import {Fees} from "../../../server-modules/fees/fees";

export default function MarginTestResults({item}:{item:MarginItem}){

    const fees = useSelector(selectFees)
    const testValue = useSelector(selectOnbuyMarginTest)
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
                onChange={e => dispatch(setMarginTest({type:"onbuy v2",value:Number(e.target.value)}))}/>
        </div>
        <div>
            Result
        </div>
    </>
}

function generateTestValues(item: MarginItem, testValue: number | null, fees: Fees | null) {    
    
    if (!fees || !testValue) return {testPrice: undefined, testMargin: undefined}

    let onbuyFlat = item.prices.purchase
        + item.marginData.postage
        + item.marginData.packaging
        + fees.flat.ebay
        + fees.subscription.ebay

    let targetMargin = ((item.prices.purchase / 100) * testValue)
    let adjustedPrice = (onbuyFlat + targetMargin) / 0.724333

    return {
        testPrice: `£${adjustedPrice.toFixed(2)}`,
        testMargin: `£${targetMargin.toFixed(2)} | ${testValue.toFixed(0)}%`
    }
}